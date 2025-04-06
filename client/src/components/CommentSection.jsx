import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import * as api from '../api';

const CommentSection = ({ post, setPost }) => {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const formattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const { data } = await api.commentPost(post._id, commentText.trim());
      
      // Update the post with the new comment
      setPost({
        ...post,
        comments: [...post.comments, data],
      });
      
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-[#3cab7d]">Comments ({post.comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3 border border-[#3cab7d]/20 rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              rows="3"
              placeholder="Add a comment..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-[#3cab7d] text-white py-2 px-6 rounded-lg hover:bg-[#2e9a6d] transition-colors disabled:opacity-50"
            disabled={loading || !commentText.trim()}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="p-4 bg-green-50 rounded-lg border border-[#3cab7d]/20 mb-6">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3cab7d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Please <Link to="/login" className="text-[#3cab7d] font-bold mx-1 hover:underline">login</Link> to add a comment.
          </p>
        </div>
      )}

      {post.comments.length > 0 ? (
        <div className="space-y-4">
          {post.comments.map((comment, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-[#3cab7d]/10">
              <div className="flex items-center mb-2">
                <Link to={`/profile/${comment.author._id}`} className="flex items-center">
                  {comment.author.profilePicture ? (
                    <img
                      src={comment.author.profilePicture}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full mr-2 border-2 border-[#3cab7d]/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-2 border-2 border-[#3cab7d]">
                      <span className="text-[#3cab7d] text-sm font-bold">
                        {comment.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-bold text-gray-800">{comment.author.name}</span>
                </Link>
                <span className="ml-2 text-sm text-gray-500">
                  • {formattedDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-white rounded-lg border border-[#3cab7d]/10 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3cab7d]/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection; 