import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    imageUrl: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.content.trim()) {
      return setError('Title and content are required');
    }
    
    // Process tags - split by commas, remove whitespace, filter empty
    const processedTags = formData.tags
      ? formData.tags
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0)
      : [];
    
    try {
      setLoading(true);
      setError('');
      
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: processedTags,
        imageUrl: formData.imageUrl.trim() || undefined,
      };
      
      // Send API request to create post
      const { data } = await api.createPost(postData);
      
      // Redirect to the new post
      navigate(`/posts/${data._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setError(
        error.response?.data?.message || 
        'Failed to create post. Please try again.'
      );
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#3cab7d]">Create New Post</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-[#3cab7d]/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              placeholder="Enter a descriptive title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block mb-2 font-medium text-gray-700">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="8"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              placeholder="Write your post content here..."
              required
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="tags" className="block mb-2 font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              placeholder="technology, programming, design"
            />
            <p className="mt-1 text-sm text-gray-500">
              Add relevant tags to help readers discover your post
            </p>
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block mb-2 font-medium text-gray-700">
              Cover Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#3cab7d] text-white rounded-lg hover:bg-[#2e9a6d] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 