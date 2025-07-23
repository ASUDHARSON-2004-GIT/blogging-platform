export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  category: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  blogId: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface BlogContextType {
  blogs: Blog[];
  loading: boolean;
  addBlog: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>) => Promise<void>;
  updateBlog: (id: string, blog: Partial<Blog>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  likeBlog: (id: string, userId: string) => Promise<void>;
  addComment: (blogId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  searchBlogs: (query: string) => Promise<Blog[]>;
  filterByCategory: (category: string) => Blog[];
}