import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { BlogCard } from '../components/BlogCard';
import { User, Edit, Calendar, BookOpen, Heart } from 'lucide-react';
import { localStorageService } from '../services/localStorageService';

export const Profile = () => {
  const { user } = useAuth();
  const { blogs, loading } = useBlog();
  const [activeTab, setActiveTab] = useState('posts');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Safely enrich blogs with author data
  const enrichedBlogs = blogs.map(blog => ({
    ...blog,
    author:
      blog.author ||
      localStorageService.getUserById(blog.authorId) || {
        id: blog.authorId,
        username: 'Unknown',
        avatar: null,
      },
  }));

  const enrichedUserBlogs = enrichedBlogs.filter(
    blog => blog.author && blog.author.id === user.id
  );
  const likedBlogs = enrichedBlogs.filter(
    blog => blog.likedBy && blog.likedBy.includes(user.id)
  );

  const totalLikes = enrichedUserBlogs.reduce((acc, blog) => acc + blog.likes, 0);
  const totalComments = enrichedUserBlogs.reduce(
    (acc, blog) => acc + blog.comments.length,
    0
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4 md:mb-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
                    <p className="text-gray-600 mb-4">{user.bio || 'No bio available'}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Member since {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <button className="flex items-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors mt-4 md:mt-0">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{enrichedUserBlogs.length}</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
            <p className="text-gray-600">Likes Received</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalComments}</p>
            <p className="text-gray-600">Comments</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{likedBlogs.length}</p>
            <p className="text-gray-600">Liked Posts</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Posts ({enrichedUserBlogs.length})
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'liked'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Liked Posts ({likedBlogs.length})
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'posts' && (
              <div>
                {enrichedUserBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrichedUserBlogs.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-6">Start writing your first blog post!</p>
                    <a
                      href="/write"
                      className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Create Your First Post
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'liked' && (
              <div>
                {likedBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedBlogs.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No liked posts</h3>
                    <p className="text-gray-600">Explore blogs and like the ones you enjoy!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
