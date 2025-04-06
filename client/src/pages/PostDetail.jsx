import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as api from '../api';
import AuthContext from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await api.getPost(id);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(error.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  const formattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setLikeLoading(true);
      const { data } = await api.likePost(post._id);
      
      setPost({
        ...post,
        likes: data.likes,
      });
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLikeLoading(false);
    }
  };
  
  const isLiked = () => {
    return user && post.likes.includes(user.id);
  };
  
  const isAuthor = () => {
    return user && post.author._id === user.id;
  };
  
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.deletePost(post._id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3cab7d]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-300">
        <p>{error}</p>
        <Link to="/" className="text-[#3cab7d] hover:text-[#2e9a6d] mt-2 inline-block">
          Go back to home
        </Link>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#3cab7d]/20">
        <h2 className="text-2xl font-bold mb-2 text-[#3cab7d]">Post Not Found</h2>
        <p className="text-gray-600 mb-4">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="text-[#3cab7d] hover:text-[#2e9a6d]">
          Go back to home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-[#3cab7d]">{post.title}</h1>
        
        <div className="flex items-center mb-4">
          <Link to={`/profile/${post.author._id}`} className="flex items-center">
            {post.author.profilePicture ? (
              <img
                src={post.author.profilePicture}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-3 border-2 border-[#3cab7d]/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 border-2 border-[#3cab7d]">
                <span className="text-[#3cab7d] text-sm font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-800">{post.author.name}</span>
              <div className="text-gray-500 text-sm">
                {formattedDate(post.createdAt)}
              </div>
            </div>
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <Link 
              to={`/?tag=${tag}`} 
              key={index} 
              className="bg-green-100 text-[#3cab7d] text-sm px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-6">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded-lg shadow-sm"
          />
        </div>
      )}
      
      {/* Post Content */}
      <div className="prose max-w-none mb-8 bg-white p-6 rounded-lg shadow-sm border border-[#3cab7d]/10">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>
      
      {/* Post Actions */}
      <div className="flex justify-between items-center py-4 border-t border-b border-[#3cab7d]/20 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              isLiked() ? 'bg-green-100 text-[#3cab7d]' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isLiked() ? 'text-[#3cab7d] fill-current' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{post.likes.length}</span>
          </button>
          
          <div className="flex items-center gap-1 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#3cab7d]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{post.comments.length}</span>
          </div>
        </div>
        
        {isAuthor() && (
          <div className="flex gap-2">
            <Link
              to={`/edit-post/${post._id}`}
              className="bg-green-100 text-[#3cab7d] px-4 py-1 rounded-lg hover:bg-green-200 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-100 text-red-700 px-4 py-1 rounded-lg hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      {/* Comments Section */}
      <CommentSection post={post} setPost={setPost} />
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-[#3cab7d]">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail; 