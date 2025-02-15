-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create custom types with existence checks
DO $$ 
BEGIN
    -- User Management
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'basic',
            'verified',
            'moderator',
            'admin',
            'super_admin'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
        CREATE TYPE verification_status AS ENUM (
            'pending',
            'under_review',
            'approved',
            'rejected',
            'expired'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grade_level') THEN
        CREATE TYPE grade_level AS ENUM (
            'freshman',
            'sophomore',
            'junior',
            'senior',
            'graduate',
            'alumni'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
        CREATE TYPE document_type AS ENUM (
            'student_id',
            'college_id',
            'acceptance_letter',
            'transcript',
            'enrollment_proof',
            'government_id'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM (
            'verification',
            'mention',
            'comment',
            'like',
            'follow',
            'chat',
            'system'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_type') THEN
        CREATE TYPE report_type AS ENUM (
            'post',
            'comment',
            'user',
            'chat',
            'verification'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
        CREATE TYPE report_status AS ENUM (
            'pending',
            'investigating',
            'resolved',
            'dismissed'
        );
    END IF;
END $$;

-- Create or replace functions first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_post_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE profiles 
        SET total_posts = total_posts + 1
        WHERE id = NEW.author_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE profiles 
        SET total_posts = GREATEST(total_posts - 1, 0)
        WHERE id = OLD.author_id;
    END IF;
    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in handle_post_statistics: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_like_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET likes_count = likes_count + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in handle_like_statistics: %', SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Core Tables
DO $$
BEGIN
    -- Colleges Table
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'colleges') THEN
        CREATE TABLE colleges (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(100) NOT NULL,
            domain VARCHAR(100) UNIQUE NOT NULL,
            logo_url TEXT,
            description TEXT,
            location GEOGRAPHY(POINT),
            address TEXT,
            website_url TEXT,
            contact_email TEXT,
            contact_phone TEXT,
            social_media JSONB DEFAULT '{}',
            programs TEXT[],
            student_count INTEGER DEFAULT 0,
            established_year INTEGER,
            accreditation_info TEXT,
            acceptance_rate NUMERIC(5,2),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT valid_established_year CHECK (established_year > 1700 AND established_year <= EXTRACT(YEAR FROM NOW()))
        );
    END IF;

    -- User Profiles
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles') THEN
        CREATE TABLE profiles (
            id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
            username VARCHAR(30) UNIQUE NOT NULL,
            display_name VARCHAR(50),
            avatar_url TEXT,
            bio VARCHAR(500),
            grade grade_level,
            role user_role DEFAULT 'basic',
            is_verified BOOLEAN DEFAULT false,
            trust_score SMALLINT DEFAULT 0 CHECK (trust_score BETWEEN 0 AND 100),
            contact_email TEXT,
            contact_phone TEXT,
            emergency_contact TEXT,
            timezone TEXT,
            languages TEXT[],
            interests TEXT[],
            followers_count INTEGER DEFAULT 0,
            following_count INTEGER DEFAULT 0,
            total_posts INTEGER DEFAULT 0,
            total_likes INTEGER DEFAULT 0,
            privacy_settings JSONB DEFAULT '{
                "show_email": false,
                "show_phone": false,
                "show_grade": false,
                "show_following": true,
                "show_followers": true,
                "allow_messages": "verified_only"
            }',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,30}$')
        );
    END IF;

    -- Verification System
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'verification_submissions') THEN
        CREATE TABLE verification_submissions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
            documents JSONB NOT NULL, -- {type: document_type, url: text, status: verification_status}
            college_email VARCHAR(100),
            email_verified BOOLEAN DEFAULT false,
            email_verified_at TIMESTAMPTZ,
            student_id TEXT,
            enrollment_year TEXT,
            expected_graduation_year TEXT,
            major TEXT,
            interview_scheduled TIMESTAMPTZ,
            interviewer_id UUID REFERENCES profiles(id),
            reviewer_id UUID REFERENCES profiles(id),
            review_notes TEXT,
            current_status verification_status DEFAULT 'pending',
            rejection_reason TEXT,
            status_history JSONB[] DEFAULT ARRAY[]::JSONB[],
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT valid_college_email CHECK (college_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
        );
    END IF;

    -- Posts System
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'posts') THEN
        CREATE TABLE posts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
            content TEXT NOT NULL,
            media_urls TEXT[],
            visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'college', 'private')),
            is_anonymous BOOLEAN DEFAULT false,
            likes_count INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            metadata JSONB DEFAULT '{}'
        );
    END IF;

    -- Comments System
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'comments') THEN
        CREATE TABLE comments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            likes_count INTEGER DEFAULT 0,
            replies_count INTEGER DEFAULT 0,
            is_edited BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    -- Likes System
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'post_likes') THEN
        CREATE TABLE post_likes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(post_id, user_id)
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'comment_likes') THEN
        CREATE TABLE comment_likes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(comment_id, user_id)
        );
    END IF;

    -- Follow System
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'follows') THEN
        CREATE TABLE follows (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(follower_id, following_id)
        );
    END IF;

    -- Notifications System
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'notifications') THEN
        CREATE TABLE notifications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            type notification_type NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            data JSONB DEFAULT '{}',
            is_read BOOLEAN DEFAULT false,
            read_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    -- Reports System
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'reports') THEN
        CREATE TABLE reports (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
            reported_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
            content_type report_type NOT NULL,
            content_id UUID NOT NULL,
            reason TEXT NOT NULL,
            description TEXT,
            evidence_urls TEXT[],
            status report_status DEFAULT 'pending',
            admin_notes TEXT,
            resolver_id UUID REFERENCES profiles(id),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            resolved_at TIMESTAMPTZ
        );
    END IF;
END $$;

-- Add this after the initial profiles table creation
DO $$
BEGIN
    -- Ensure bio column exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'bio'
    ) THEN
        ALTER TABLE profiles ADD COLUMN bio VARCHAR(500);
    END IF;
END $$;

-- Create indexes with error handling
DO $$
BEGIN
    -- Profile indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_username') THEN
        CREATE INDEX idx_profiles_username ON profiles USING btree(username);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_role') THEN
        CREATE INDEX idx_profiles_role ON profiles(role);
    END IF;

    -- College indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_colleges_domain') THEN
        CREATE INDEX idx_colleges_domain ON colleges(domain);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_colleges_name_trgm') THEN
        CREATE INDEX idx_colleges_name_trgm ON colleges USING gin(name gin_trgm_ops);
    END IF;

    -- Verification indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_verifications_status') THEN
        CREATE INDEX idx_verifications_status ON verification_submissions(current_status);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_verifications_user') THEN
        CREATE INDEX idx_verifications_user ON verification_submissions(user_id);
    END IF;

    -- Post indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_posts_author') THEN
        CREATE INDEX idx_posts_author ON posts(author_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_posts_college') THEN
        CREATE INDEX idx_posts_college ON posts(college_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_posts_created') THEN
        CREATE INDEX idx_posts_created ON posts(created_at DESC);
    END IF;

    -- Comment indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_comments_post') THEN
        CREATE INDEX idx_comments_post ON comments(post_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_comments_author') THEN
        CREATE INDEX idx_comments_author ON comments(author_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_comments_parent') THEN
        CREATE INDEX idx_comments_parent ON comments(parent_id);
    END IF;

    -- Like indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_post_likes_post') THEN
        CREATE INDEX idx_post_likes_post ON post_likes(post_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_post_likes_user') THEN
        CREATE INDEX idx_post_likes_user ON post_likes(user_id);
    END IF;

    -- Follow indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_follows_follower') THEN
        CREATE INDEX idx_follows_follower ON follows(follower_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_follows_following') THEN
        CREATE INDEX idx_follows_following ON follows(following_id);
    END IF;

    -- Notification indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user') THEN
        CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_unread') THEN
        CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE NOT is_read;
    END IF;

    -- Additional performance indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_posts_visibility_created') THEN
        CREATE INDEX idx_posts_visibility_created ON posts(visibility, created_at DESC);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_verification_email') THEN
        CREATE INDEX idx_verification_email ON verification_submissions(college_email) 
        WHERE email_verified = false;
    END IF;
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table does not exist yet for index creation';
    WHEN duplicate_table THEN
        RAISE NOTICE 'Index already exists';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating index: %', SQLERRM;
END $$;

-- Enable RLS and create policies
DO $$
BEGIN
    -- Enable RLS on all tables
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
    ALTER TABLE verification_submissions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

    -- Create policies with better checks
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
    CREATE POLICY "Profiles are viewable by everyone" ON profiles
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    CREATE POLICY "Users can update own profile" ON profiles
        FOR UPDATE USING (auth.uid() = id);

    -- Post Policies
    DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
    CREATE POLICY "Posts are viewable by everyone" ON posts
        FOR SELECT USING (
            visibility = 'public' OR 
            auth.uid() = author_id OR 
            (visibility = 'college' AND EXISTS (
                SELECT 1 FROM verification_submissions 
                WHERE user_id = auth.uid() 
                AND college_id = posts.college_id 
                AND current_status = 'approved'
            ))
        );

    DROP POLICY IF EXISTS "Users can create posts" ON posts;
    CREATE POLICY "Users can create posts" ON posts
        FOR INSERT WITH CHECK (auth.uid() = author_id);

    DROP POLICY IF EXISTS "Users can update own posts" ON posts;
    CREATE POLICY "Users can update own posts" ON posts
        FOR UPDATE USING (auth.uid() = author_id);

    -- Comment Policies
    DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
    CREATE POLICY "Comments are viewable by everyone" ON comments
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Users can create comments" ON comments;
    CREATE POLICY "Users can create comments" ON comments
        FOR INSERT WITH CHECK (auth.uid() = author_id);

    -- Like Policies
    DROP POLICY IF EXISTS "Likes are viewable by everyone" ON post_likes;
    CREATE POLICY "Likes are viewable by everyone" ON post_likes
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Users can manage their likes" ON post_likes;
    CREATE POLICY "Users can manage their likes" ON post_likes
        FOR ALL USING (auth.uid() = user_id);

    -- Follow Policies
    DROP POLICY IF EXISTS "Follows are viewable by everyone" ON follows;
    CREATE POLICY "Follows are viewable by everyone" ON follows
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Users can manage their follows" ON follows;
    CREATE POLICY "Users can manage their follows" ON follows
        FOR ALL USING (auth.uid() = follower_id);

    -- Notification Policies
    DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
    CREATE POLICY "Users can view own notifications" ON notifications
        FOR SELECT USING (auth.uid() = user_id);

    -- Report Policies
    DROP POLICY IF EXISTS "Users can create reports" ON reports;
    CREATE POLICY "Users can create reports" ON reports
        FOR INSERT WITH CHECK (auth.uid() = reporter_id);

    DROP POLICY IF EXISTS "Admins can view reports" ON reports;
    CREATE POLICY "Admins can view reports" ON reports
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM profiles
                WHERE id = auth.uid()
                AND role IN ('admin', 'super_admin')
            )
        );
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table does not exist yet for policy creation';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating policy: %', SQLERRM;
END $$;

-- Create triggers with error handling
DO $$
BEGIN
    -- Update triggers
    DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
    CREATE TRIGGER trigger_profiles_updated_at
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    -- Post statistics trigger
    DROP TRIGGER IF EXISTS trigger_post_statistics ON posts;
    CREATE TRIGGER trigger_post_statistics
        AFTER INSERT OR DELETE ON posts
        FOR EACH ROW
        EXECUTE FUNCTION handle_post_statistics();

    -- Like statistics trigger
    DROP TRIGGER IF EXISTS trigger_like_statistics ON post_likes;
    CREATE TRIGGER trigger_like_statistics
        AFTER INSERT OR DELETE ON post_likes
        FOR EACH ROW
        EXECUTE FUNCTION handle_like_statistics();
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table does not exist yet for trigger creation';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating trigger: %', SQLERRM;
END $$;

-- Add this at the beginning of the file, after extensions
DO $$
BEGIN
    -- Create storage bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name)
    VALUES ('avatars', 'avatars')
    ON CONFLICT (id) DO NOTHING;

    -- Set storage policy
    CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'avatars' );

    CREATE POLICY "Authenticated users can upload avatars"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK ( bucket_id = 'avatars' );
END $$; 