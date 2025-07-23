import React from 'react';
import { Link } from 'react-router-dom';
import { LocalBlog } from '../services/localStorageService';
import { Heart, MessageCircle, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { localStorageService } from '../services/localStorageService';

interface BlogCardProps {
  blog: LocalBlog & { author?: any };
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const { likeBlog } = useBlog();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated && user) {
      likeBlog(blog.id, user.id);
    }
  };

  const isLiked = user ? blog.likedBy?.includes(user.id) : false;
  
  // Get author info
  const author = blog.author || localStorageService.getUserById(blog.authorId) || {
    id: blog.authorId,
    username: 'Unknown User',
    avatar: null
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link to={`/blog/${blog.id}`}>
        {blog.coverImage && (
          <div className="h-48 overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {blog.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(blog.createdAt)}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {blog.excerpt || stripHtml(blog.content).substring(0, 150) + '...'}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.username}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400 mr-2" />
                )}
                <span className="text-sm text-gray-700 font-medium">
                  {author.username}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-sm transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
                disabled={!isAuthenticated}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{blog.likes}</span>
              </button>
              
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span>{blog.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};