import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { localStorageService } from '../services/localStorageService';
import { Heart, MessageCircle, Calendar, User, Edit, Trash2, ArrowLeft, Send } from 'lucide-react';

export const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogs, likeBlog, addComment, deleteBlog } = useBlog();
  const { user, isAuthenticated } = useAuth();
  const [commentContent, setCommentContent] = useState('');

  const blog = blogs.find(b => b.id === id);
  const author = blog ? localStorageService.getUserById(blog.authorId) : null;

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <Link to="/blogs" className="text-blue-600 hover:text-blue-700">
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (isAuthenticated && user) {
      likeBlog(blog.id, user.id);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated && user && commentContent.trim()) {
      addComment(blog.id, commentContent, user.id);
      setCommentContent('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(blog.id);
      navigate('/blogs');
    }
  };

  const isLiked = user ? blog.likedBy.includes(user.id) : false;
  const canEdit = user && (user.id === blog.authorId || user.isAdmin);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/blogs"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Link>

        {/* Blog Content */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {blog.coverImage && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {blog.category}
                </span>
                {canEdit && (
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/edit/${blog.id}`}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex items-center text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {author?.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.username}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-400 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{author?.username || 'Unknown User'}</p>
                      <p className="text-gray-500 text-sm">{author?.bio || ''}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(blog.createdAt)}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Actions */}
            <div className="flex items-center justify-between border-t pt-6">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                  disabled={!isAuthenticated}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{blog.likes} likes</span>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="h-5 w-5" />
                  <span>{blog.comments.length} comments</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({blog.comments.length})
          </h3>

          {/* Add Comment */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex space-x-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-10 w-10 rounded-full flex-shrink-0"
                  />
                ) : (
                  <User className="h-10 w-10 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!commentContent.trim()}
                      className="flex items-center bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
              <p className="text-gray-600 mb-4">Please log in to leave a comment</p>
              <Link
                to="/login"
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Log In
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {blog.comments.map((comment) => {
              const commentAuthor = localStorageService.getUserById(comment.authorId);
              return (
                <div key={comment.id} className="flex space-x-3">
                  {commentAuthor?.avatar ? (
                    <img
                      src={commentAuthor.avatar}
                      alt={commentAuthor.username}
                      className="h-10 w-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <User className="h-10 w-10 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{commentAuthor?.username || 'Unknown User'}</span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {blog.comments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};