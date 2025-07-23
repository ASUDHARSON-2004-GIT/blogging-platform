import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { BlogCard } from '../components/BlogCard';
import { PenTool, TrendingUp, Users, BookOpen, User } from 'lucide-react';
import { localStorageService } from '../services/localStorageService';

export const Home = () => {
  const { blogs, loading } = useBlog();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(blogs.map(blog => blog.category)))];

  const filteredBlogs = blogs
    .filter(blog => selectedCategory === 'All' || blog.category === selectedCategory)
    .slice(0, 6);

  const featuredBlog = blogs[0];

  // Get author info for blogs
  const getBlogWithAuthor = (blog: any) => {
    const author = localStorageService.getUserById(blog.authorId);
    return {
      ...blog,
      author: author || {
        id: blog.authorId,
        username: 'Unknown User',
        email: '',
        bio: '',
        createdAt: new Date().toISOString()
      }
    };
  };

  const blogsWithAuthors = blogs.map(getBlogWithAuthor);
  const featuredBlogWithAuthor = featuredBlog ? getBlogWithAuthor(featuredBlog) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Share Your <span className="text-blue-300">Stories</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              A modern blogging platform for writers and readers to connect and share amazing stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/write"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Writing
              </Link>
              <Link
                to="/blogs"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore Blogs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{blogs.length}+</h3>
              <p className="text-gray-600">Blog Posts</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{localStorageService.getUsers().length}+</h3>
              <p className="text-gray-600">Active Writers</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{blogs.reduce((acc, blog) => acc + blog.likes, 0)}+</h3>
              <p className="text-gray-600">Total Likes</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{categories.length - 1}+</h3>
              <p className="text-gray-600">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog */}
      {featuredBlogWithAuthor && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Story</h2>
              <p className="text-xl text-gray-600">Discover our most popular content</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  {featuredBlogWithAuthor.coverImage && (
                    <img
                      src={featuredBlogWithAuthor.coverImage}
                      alt={featuredBlogWithAuthor.title}
                      className="h-64 md:h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {featuredBlogWithAuthor.category}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredBlogWithAuthor.title}
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    {featuredBlogWithAuthor.excerpt}
                  </p>
                  <div className="flex items-center mb-6">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{featuredBlogWithAuthor.author.username}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(featuredBlogWithAuthor.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${featuredBlogWithAuthor.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Read Full Story →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Blogs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Stories</h2>
            <p className="text-xl text-gray-600">Fresh content from our community</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogsWithAuthors.slice(0, 6).map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/blogs"
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Blogs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};