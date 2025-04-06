import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const truncateContent = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg border border-[#3cab7d]/20">
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-48 object-cover" 
        />
      )}
      
      <div className="p-5">
        <Link to={`/posts/${post._id}`}>
          <h2 className="text-xl font-bold mb-2 text-[#3cab7d] hover:text-[#2e9a6d]">{post.title}</h2>
        </Link>
        
        <p className="text-gray-700 mb-3">{truncateContent(post.content)}</p>
        
        <div className="flex items-center mb-3">
          <Link to={`/profile/${post.author._id}`} className="flex items-center">
            {post.author.profilePicture ? (
              <img 
                src={post.author.profilePicture} 
                alt={post.author.name} 
                className="w-8 h-8 rounded-full mr-2 border-2 border-[#3cab7d]/20" 
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2 border-2 border-[#3cab7d]">
                <span className="text-[#3cab7d] text-sm font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-gray-700 font-medium">{post.author.name}</span>
          </Link>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.map((tag) => (
              <Link 
                key={tag} 
                to={`/?tag=${tag}`}
                className="inline-block px-2 py-1 bg-green-100 text-[#3cab7d] text-xs rounded-full hover:bg-green-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <div className="flex items-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#3cab7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments && post.comments.length ? post.comments.length : 0}
            </div>
            <span>{formattedDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 