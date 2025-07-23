import { supabase } from '../lib/supabase';
import { Blog, Comment } from '../types';

export const blogService = {
  async getBlogs(): Promise<Blog[]> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            bio,
            avatar_url,
            is_admin,
            created_at
          ),
          comments (
            id,
            content,
            created_at,
            profiles:author_id (
              id,
              username,
              avatar_url
            )
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(blog => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        category: blog.category,
        tags: blog.tags || [],
        coverImage: blog.cover_image_url,
        author: {
          id: blog.profiles.id,
          username: blog.profiles.username,
          email: '',
          bio: blog.profiles.bio,
          avatar: blog.profiles.avatar_url,
          isAdmin: blog.profiles.is_admin,
          createdAt: blog.profiles.created_at,
        },
        likes: blog.likes_count,
        likedBy: [], // Will be populated separately
        comments: blog.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          author: {
            id: comment.profiles.id,
            username: comment.profiles.username,
            email: '',
            avatar: comment.profiles.avatar_url,
            createdAt: comment.created_at,
          },
          blogId: blog.id,
          createdAt: comment.created_at,
        })),
        createdAt: blog.created_at,
        updatedAt: blog.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  },

  async getBlog(id: string): Promise<Blog | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            bio,
            avatar_url,
            is_admin,
            created_at
          ),
          comments (
            id,
            content,
            created_at,
            profiles:author_id (
              id,
              username,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        tags: data.tags || [],
        coverImage: data.cover_image_url,
        author: {
          id: data.profiles.id,
          username: data.profiles.username,
          email: '',
          bio: data.profiles.bio,
          avatar: data.profiles.avatar_url,
          isAdmin: data.profiles.is_admin,
          createdAt: data.profiles.created_at,
        },
        likes: data.likes_count,
        likedBy: [], // Will be populated separately
        comments: data.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          author: {
            id: comment.profiles.id,
            username: comment.profiles.username,
            email: '',
            avatar: comment.profiles.avatar_url,
            createdAt: comment.created_at,
          },
          blogId: data.id,
          createdAt: comment.created_at,
        })),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  },

  async createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert({
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          category: blog.category,
          tags: blog.tags,
          cover_image_url: blog.coverImage,
          author_id: blog.author.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async updateBlog(id: string, updates: Partial<Blog>) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .update({
          title: updates.title,
          content: updates.content,
          excerpt: updates.excerpt,
          category: updates.category,
          tags: updates.tags,
          cover_image_url: updates.coverImage,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async deleteBlog(id: string) {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async likeBlog(blogId: string, userId: string) {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', blogId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', blogId)
          .eq('user_id', userId);

        if (error) throw error;
        return { liked: false, error: null };
      } else {
        // Like
        const { error } = await supabase
          .from('blog_likes')
          .insert({
            blog_id: blogId,
            user_id: userId,
          });

        if (error) throw error;
        return { liked: true, error: null };
      }
    } catch (error) {
      return { liked: false, error: error.message };
    }
  },

  async getBlogLikes(blogId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('blog_likes')
        .select('user_id')
        .eq('blog_id', blogId);

      if (error) throw error;
      return data.map(like => like.user_id);
    } catch (error) {
      console.error('Error fetching blog likes:', error);
      return [];
    }
  },

  async addComment(blogId: string, content: string, authorId: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          blog_id: blogId,
          author_id: authorId,
        })
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      const comment: Comment = {
        id: data.id,
        content: data.content,
        author: {
          id: data.profiles.id,
          username: data.profiles.username,
          email: '',
          avatar: data.profiles.avatar_url,
          createdAt: data.created_at,
        },
        blogId: data.blog_id,
        createdAt: data.created_at,
      };

      return { data: comment, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async searchBlogs(query: string): Promise<Blog[]> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            bio,
            avatar_url,
            is_admin,
            created_at
          )
        `)
        .eq('published', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(blog => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        category: blog.category,
        tags: blog.tags || [],
        coverImage: blog.cover_image_url,
        author: {
          id: blog.profiles.id,
          username: blog.profiles.username,
          email: '',
          bio: blog.profiles.bio,
          avatar: blog.profiles.avatar_url,
          isAdmin: blog.profiles.is_admin,
          createdAt: blog.profiles.created_at,
        },
        likes: blog.likes_count,
        likedBy: [],
        comments: [],
        createdAt: blog.created_at,
        updatedAt: blog.updated_at,
      }));
    } catch (error) {
      console.error('Error searching blogs:', error);
      return [];
    }
  },
};