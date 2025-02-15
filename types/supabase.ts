export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          campus_id: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          campus_id?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          campus_id?: string | null
          is_verified?: boolean
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          content: string
          media_urls: string[] | null
          location: Json | null
          tags: string[] | null
          campus_specific: boolean
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          content: string
          media_urls?: string[] | null
          location?: Json | null
          tags?: string[] | null
          campus_specific?: boolean
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          media_urls?: string[] | null
          location?: Json | null
          tags?: string[] | null
          campus_specific?: boolean
          likes_count?: number
          comments_count?: number
          updated_at?: string
        }
      }
      chat_rooms: {
        Row: {
          id: string
          name: string | null
          type: 'direct' | 'group' | 'campus'
          campus_id: string | null
          last_message_at: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          type: 'direct' | 'group' | 'campus'
          campus_id?: string | null
          metadata?: Json
        }
        Update: {
          name?: string | null
          type?: 'direct' | 'group' | 'campus'
          campus_id?: string | null
          last_message_at?: string
          metadata?: Json
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'mention' | 'comment' | 'like' | 'follow' | 'verification' | 'chat' | 'system'
          title: string
          content: string | null
          data: Json
          read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          type: 'mention' | 'comment' | 'like' | 'follow' | 'verification' | 'chat' | 'system'
          title: string
          content?: string | null
          data?: Json
        }
        Update: {
          read?: boolean
          read_at?: string | null
        }
      }
      // Add other table types...
    }
  }
} 