// Local storage service for fast, reliable data management
export interface LocalUser {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface LocalBlog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage?: string;
  authorId: string;
  likes: number;
  likedBy: string[];
  comments: LocalComment[];
  createdAt: string;
  updatedAt: string;
}

export interface LocalComment {
  id: string;
  content: string;
  authorId: string;
  blogId: string;
  createdAt: string;
}

class LocalStorageService {
  private USERS_KEY = 'blogspace_users';
  private BLOGS_KEY = 'blogspace_blogs';
  private CURRENT_USER_KEY = 'blogspace_current_user';

  // Initialize with sample data
  init() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const sampleUsers: LocalUser[] = [
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          bio: 'Tech enthusiast and blogger',
          createdAt: new Date().toISOString(),
          isAdmin: true
        },
        {
          id: '2',
          username: 'jane_smith',
          email: 'jane@example.com',
          bio: 'Writer and designer',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(sampleUsers));
    }

    if (!localStorage.getItem(this.BLOGS_KEY)) {
      const sampleBlogs: LocalBlog[] = [
        {
          id: '1',
          title: 'Welcome to BlogSpace',
          content: '<p>This is a fast, reliable blogging platform that works instantly! No loading delays, no connection issues.</p><p>Features include:</p><ul><li>Instant loading</li><li>Rich text editing</li><li>Like and comment system</li><li>User profiles</li><li>Admin dashboard</li></ul>',
          excerpt: 'A fast, reliable blogging platform that works instantly',
          category: 'Technology',
          tags: ['welcome', 'blogging', 'fast'],
          coverImage: 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800',
          authorId: '1',
          likes: 15,
          likedBy: [],
          comments: [
            {
              id: '1',
              content: 'Great platform! Very fast and reliable.',
              authorId: '2',
              blogId: '1',
              createdAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Building Fast Web Applications',
          content: '<p>Speed is crucial for user experience. Here are key principles for building fast web applications:</p><h3>1. Minimize Dependencies</h3><p>Use only what you need. Heavy frameworks can slow down your app.</p><h3>2. Local Storage</h3><p>Store data locally when possible to avoid network delays.</p><h3>3. Optimize Images</h3><p>Use compressed images and modern formats.</p>',
          excerpt: 'Key principles for building lightning-fast web applications',
          category: 'Development',
          tags: ['performance', 'web-development', 'optimization'],
          coverImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
          authorId: '2',
          likes: 8,
          likedBy: [],
          comments: [],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem(this.BLOGS_KEY, JSON.stringify(sampleBlogs));
    }
  }

  // User methods
  getUsers(): LocalUser[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  getUserById(id: string): LocalUser | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string): LocalUser | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  createUser(userData: Omit<LocalUser, 'id' | 'createdAt'>): LocalUser {
    const users = this.getUsers();
    const newUser: LocalUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return newUser;
  }

  updateUser(id: string, updates: Partial<LocalUser>): LocalUser | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return users[userIndex];
  }

  // Auth methods
  getCurrentUser(): LocalUser | null {
    const userId = localStorage.getItem(this.CURRENT_USER_KEY);
    return userId ? this.getUserById(userId) : null;
  }

  setCurrentUser(user: LocalUser | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, user.id);
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  // Blog methods
  getBlogs(): LocalBlog[] {
    return JSON.parse(localStorage.getItem(this.BLOGS_KEY) || '[]');
  }

  getBlogById(id: string): LocalBlog | null {
    const blogs = this.getBlogs();
    return blogs.find(blog => blog.id === id) || null;
  }

  createBlog(blogData: Omit<LocalBlog, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>): LocalBlog {
    const blogs = this.getBlogs();
    const newBlog: LocalBlog = {
      ...blogData,
      id: Date.now().toString(),
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    blogs.unshift(newBlog);
    localStorage.setItem(this.BLOGS_KEY, JSON.stringify(blogs));
    return newBlog;
  }

  updateBlog(id: string, updates: Partial<LocalBlog>): LocalBlog | null {
    const blogs = this.getBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === id);
    if (blogIndex === -1) return null;

    blogs[blogIndex] = { 
      ...blogs[blogIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(this.BLOGS_KEY, JSON.stringify(blogs));
    return blogs[blogIndex];
  }

  deleteBlog(id: string): boolean {
    const blogs = this.getBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    if (filteredBlogs.length === blogs.length) return false;
    
    localStorage.setItem(this.BLOGS_KEY, JSON.stringify(filteredBlogs));
    return true;
  }

  likeBlog(blogId: string, userId: string): boolean {
    const blogs = this.getBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    if (blogIndex === -1) return false;

    const blog = blogs[blogIndex];
    const isLiked = blog.likedBy.includes(userId);

    if (isLiked) {
      blog.likedBy = blog.likedBy.filter(id => id !== userId);
      blog.likes = Math.max(0, blog.likes - 1);
    } else {
      blog.likedBy.push(userId);
      blog.likes += 1;
    }

    localStorage.setItem(this.BLOGS_KEY, JSON.stringify(blogs));
    return !isLiked;
  }

  addComment(blogId: string, commentData: Omit<LocalComment, 'id' | 'createdAt'>): LocalComment | null {
    const blogs = this.getBlogs();
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    if (blogIndex === -1) return null;

    const newComment: LocalComment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    blogs[blogIndex].comments.push(newComment);
    localStorage.setItem(this.BLOGS_KEY, JSON.stringify(blogs));
    return newComment;
  }

  searchBlogs(query: string): LocalBlog[] {
    const blogs = this.getBlogs();
    const lowercaseQuery = query.toLowerCase();
    
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(lowercaseQuery) ||
      blog.content.toLowerCase().includes(lowercaseQuery) ||
      blog.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const localStorageService = new LocalStorageService();