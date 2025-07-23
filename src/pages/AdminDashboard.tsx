import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/BlogCard';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Shield,
  Search,
  Filter,
  Trash2,
  Edit
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { blogs, deleteBlog, loading } = useBlog();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  const categories = ['All', ...Array.from(new Set(blogs.map(blog => blog.category)))];
  
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchQuery === '' || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes, 0);
  const totalComments = blogs.reduce((acc, blog) => acc + blog.comments.length, 0);
  const uniqueAuthors = new Set(blogs.map(blog => blog.author.id)).size;

  const handleDeleteBlog = (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      deleteBlog(blogId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your blogging platform</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'blogs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Blogs
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Blogs</p>
                        <p className="text-3xl font-bold">{blogs.length}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Total Likes</p>
                        <p className="text-3xl font-bold">{totalLikes}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Total Comments</p>
                        <p className="text-3xl font-bold">{totalComments}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Active Authors</p>
                        <p className="text-3xl font-bold">{uniqueAuthors}</p>
                      </div>
                      <Users className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Blogs</h3>
                  <div className="space-y-4">
                    {blogs.slice(0, 5).map((blog) => (
                      <div key={blog.id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{blog.title}</h4>
                          <p className="text-sm text-gray-600">
                            by {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{blog.likes} likes</span>
                          <span>•</span>
                          <span>{blog.comments.length} comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div>
                {/* Search and Filters */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search blogs or authors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Filter className="h-5 w-5 text-gray-400" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Blog Management */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Manage Blogs ({filteredBlogs.length})</h3>
                  
                  {filteredBlogs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-lg p-6 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                  {blog.category}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h4>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span>by {blog.author.username}</span>
                                <span>•</span>
                                <span>{blog.likes} likes</span>
                                <span>•</span>
                                <span>{blog.comments.length} comments</span>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {blog.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <a
                                href={`/edit/${blog.id}`}
                                className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </a>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};