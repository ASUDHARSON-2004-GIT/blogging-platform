import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { RichTextEditor } from '../components/RichTextEditor';
import { Save, Eye, ArrowLeft } from 'lucide-react';

export const WriteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { blogs, addBlog, updateBlog } = useBlog();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!id;
  const blog = isEditing ? blogs.find(b => b.id === id) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEditing && blog) {
      if (user?.id !== blog.author.id && !user?.isAdmin) {
        navigate('/blogs');
        return;
      }
      
      setTitle(blog.title);
      setContent(blog.content);
      setExcerpt(blog.excerpt || '');
      setCategory(blog.category);
      setTags(blog.tags.join(', '));
      setCoverImage(blog.coverImage || '');
    }
  }, [isAuthenticated, isEditing, blog, user, navigate]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !user) return;

    setIsSaving(true);
    
    try {
      const blogData = {
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        coverImage: coverImage.trim(),
        authorId: user.id
      };

      if (isEditing) {
        await updateBlog(id!, blogData);
      } else {
        await addBlog(blogData);
      }

      navigate('/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const categories = ['Technology', 'Design', 'Business', 'Science', 'Health', 'Travel', 'Food', 'Lifestyle'];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || isSaving}
              className="flex items-center bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          {isPreview ? (
            /* Preview Mode */
            <div className="p-8">
              {coverImage && (
                <div className="h-64 md:h-96 overflow-hidden rounded-lg mb-8">
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                {excerpt && (
                  <p className="text-xl text-gray-600 mb-6">{excerpt}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
              
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            /* Edit Mode */
            <div className="p-8">
              <div className="space-y-6">
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-semibold"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (optional)
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of your blog..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Category and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="react, javascript, web"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Start writing your amazing blog post..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};