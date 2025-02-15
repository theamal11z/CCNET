# CampusConnect User System Documentation

## User Types & Permissions

### 1. Basic User
- Has a pseudonymous username
- Can view public posts and profiles
- Can follow other users
- Can like and comment on posts
- Can create general posts
- Limited access to college-specific content

### 2. Verified College User
- All Basic User permissions
- Verified badge displayed on profile
- Can post college-specific content
- Access to college-specific chat rooms
- Can participate in college discussions
- Higher trust score in the community

### 3. Admin User
- All Verified User permissions
- Access to moderation tools
- Can review verification requests
- Can remove inappropriate content
- Access to analytics dashboard

## Profile Screen Features

### 1. Profile Header
- Profile Image
- Username with verification badge (if verified)
- Display name (optional)
- College affiliation (if verified)
- Bio/About section


### 2. Statistics Section
- Total posts count
- Followers count
- Following count
- Total likes received
- Posts

### 3. Content Tabs
- Posts Tab
  - Shows user's posts in chronological order
  - Includes both general and college-specific posts
  - Shows post engagement metrics

- Likes Tab
  - Posts the user has liked
  - Organized chronologically
  - Quick access to engaged content

- College Content Tab (for verified users)
  - College-specific posts
  - Reviews and ratings
  - College-related discussions

### 4. Action Buttons
- Edit Profile (for own profile)
- Follow/Unfollow (for other profiles)

- Settings (for own profile)
- Logout (for own profile)

### 5. Verification Status
- Verification badge display
- College affiliation

## User Privacy Features

### 1. Identity Protection
- Real name hidden
- Email address private
- College affiliation visible only after verification
- Option to hide following/follower lists

 ### 2. Content Control
- Delete own posts
- Hide liked posts
- Block other users
- Control who can message them 

### 3. College Verification
- Secure upload of verification documents
- College email verification
- Manual review process
- Revocation possibility





<!-- ## Engagement Features

### 1. Interaction Metrics
- Posts engagement rate
- Response time
- Quality score
- Helper badges

### 2. Rewards System
- Verification perks
- Engagement rewards
- Special badges
- Access to exclusive features -->

## Technical Implementation Notes

### 1. Data Storage
- User profile data in Supabase
- Media files in secure storage

- Cached profile data for performance



### 3. Performance Considerations
- Lazy loading of content
- Optimized image loading
- Pagination of posts/likes
- Background data refresh


