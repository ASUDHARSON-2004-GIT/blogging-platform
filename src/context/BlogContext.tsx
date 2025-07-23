import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localStorageService, LocalBlog, LocalComment, LocalUser } from '../services/localStorageService';

interface BlogContextType {
  blogs: LocalBlog[];
  loading: boolean;
  addBlog: (blog: Omit<LocalBlog, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>) => Promise<void>;
  updateBlog: (id: string, blog: Partial<LocalBlog>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  likeBlog: (id: string, userId: string) => Promise<void>;
  addComment: (blogId: string, content: string, authorId: string) => Promise<void>;
  searchBlogs: (query: string) => Promise<LocalBlog[]>;
  filterByCategory: (category: string) => LocalBlog[];
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<LocalBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    try {
      setLoading(true);
      localStorageService.init();
      const blogsData = localStorageService.getBlogs();
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error loading blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const addBlog = async (blogData: Omit<LocalBlog, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>) => {
    try {
      const newBlog = localStorageService.createBlog(blogData);
      setBlogs(prev => [newBlog, ...prev]);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const updateBlog = async (id: string, blogData: Partial<LocalBlog>) => {
    try {
      const updatedBlog = localStorageService.updateBlog(id, blogData);
      if (updatedBlog) {
        setBlogs(prev => prev.map(blog => blog.id === id ? updatedBlog : blog));
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      const success = localStorageService.deleteBlog(id);
      if (success) {
        setBlogs(prev => prev.filter(blog => blog.id !== id));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const likeBlog = async (id: string, userId: string) => {
    try {
      const liked = localStorageService.likeBlog(id, userId);
      setBlogs(prev => prev.map(blog => {
        if (blog.id === id) {
          return {
            ...blog,
            likes: liked ? blog.likes + 1 : blog.likes - 1,
            likedBy: liked 
              ? [...blog.likedBy, userId]
              : blog.likedBy.filter(uid => uid !== userId)
          };
        }
        return blog;
      }));
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const addComment = async (blogId: string, content: string, authorId: string) => {
    try {
      const newComment = localStorageService.addComment(blogId, {
        content,
        authorId,
        blogId
      });
      
      if (newComment) {
        setBlogs(prev => prev.map(blog => 
          blog.id === blogId 
            ? { ...blog, comments: [...blog.comments, newComment] }
            : blog
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const searchBlogs = async (query: string): Promise<LocalBlog[]> => {
    try {
      return localStorageService.searchBlogs(query);
    } catch (error) {
      console.error('Error searching blogs:', error);
      return [];
    }
  };

  const filterByCategory = (category: string) => {
    return blogs.filter(blog => blog.category === category);
  };

  return (
    <BlogContext.Provider value={{
      blogs,
      loading,
      addBlog,
      updateBlog,
      deleteBlog,
      likeBlog,
      addComment,
      searchBlogs,
      filterByCategory
    }}>
      {children}
    </BlogContext.Provider>
  );
};