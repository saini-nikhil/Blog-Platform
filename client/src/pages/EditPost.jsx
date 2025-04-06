import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api';
import AuthContext from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await api.getPost(id);
        
        // Check if user is author
        if (!user || data.author._id !== user.id) {
          navigate(`/posts/${id}`);
          return;
        }
        
        setFormData({
          title: data.title,
          content: data.content,
          tags: data.tags.join(', '),
          imageUrl: data.imageUrl || '',
        });
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, user, navigate]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!formData.title || !formData.content) {
      return setError('Title and content are required');
    }
    
    try {
      setUpdateLoading(true);
      await api.updatePost(id, formData);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Update post error:', error);
      setError(
        error.response?.data?.message || 
        'Failed to update post. Please try again.'
      );
    } finally {
      setUpdateLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-primary"
            placeholder="Enter post title"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block mb-1 font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-primary"
            rows="12"
            placeholder="Write your post content here..."
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="tags" className="block mb-1 font-medium">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-primary"
            placeholder="Enter tags separated by commas (e.g. technology, programming, web)"
          />
        </div>
        
        <div>
          <label htmlFor="imageUrl" className="block mb-1 font-medium">
            Image URL (optional)
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring focus:ring-primary"
            placeholder="Enter URL for post image"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-black py-2 px-4 rounded hover:bg-secondary transition disabled:opacity-50"
            disabled={updateLoading}
          >
            {updateLoading ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost; 