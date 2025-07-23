import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client with fallback values - will show connection errors in UI instead of crashing
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';
};

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          bio: string;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          bio?: string;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          bio?: string;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      blogs: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string;
          category: string;
          tags: string[];
          cover_image_url: string | null;
          author_id: string;
          likes_count: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          excerpt?: string;
          category?: string;
          tags?: string[];
          cover_image_url?: string | null;
          author_id: string;
          likes_count?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          excerpt?: string;
          category?: string;
          tags?: string[];
          cover_image_url?: string | null;
          author_id?: string;
          likes_count?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_likes: {
        Row: {
          id: string;
          blog_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          blog_id: string;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          blog_id: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          blog_id?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}