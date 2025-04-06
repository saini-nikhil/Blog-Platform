import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../api';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();
  
  const activeTag = searchParams.get('tag');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        
        const { data } = await api.getPosts(currentPage, 8, activeTag);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        
        // If we're on the first page and no tag filter, get popular tags
        if (currentPage === 1 && !activeTag) {
          try {
            const tagsResponse = await api.getPopularTags();
            setPopularTags(tagsResponse.data.slice(0, 10)); // Get top 10 tags
          } catch (error) {
            console.error('Error fetching tags:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, activeTag]);
  
  const handleTagClick = (tag) => {
    // Reset to first page when selecting a tag
    setCurrentPage(1);
    navigate(`/?tag=${tag}`);
  };
  
  const clearTagFilter = () => {
    setCurrentPage(1);
    navigate('/');
  };
  
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#3cab7d]/20">
        <h1 className="text-3xl font-bold text-[#3cab7d] mb-2">
          {activeTag ? `Posts tagged with #${activeTag}` : 'Welcome to Blog App'}
        </h1>
        <p className="text-gray-600">
          {activeTag 
            ? `Browse all articles related to ${activeTag}`
            : 'Discover stories, thinking, and expertise from writers on any topic.'
          }
        </p>
        
        {activeTag && (
          <button 
            onClick={clearTagFilter}
            className="mt-4 inline-flex items-center text-[#3cab7d] hover:text-[#2e9a6d]"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to all posts
          </button>
        )}
      </div>
      
      {/* Popular tags section */}
      {!activeTag && popularTags.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#3cab7d]/20">
          <h2 className="text-xl font-bold text-[#3cab7d] mb-4">Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => handleTagClick(tag.name)}
                className="px-3 py-1 bg-green-100 text-[#3cab7d] rounded-full hover:bg-green-200 transition-colors"
              >
                #{tag.name} {tag.count && <span className="text-[#3cab7d]">({tag.count})</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Posts section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#3cab7d]">
          {activeTag ? `#${activeTag} Posts` : 'Latest Posts'}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3cab7d]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded border border-red-300">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#3cab7d]/20">
            <h2 className="text-2xl font-bold mb-2 text-[#3cab7d]">No Posts Found</h2>
            <p className="text-gray-600 mb-4">
              {activeTag 
                ? `There are no posts with the tag "${activeTag}".`
                : 'There are no posts yet. Be the first to create one!'}
            </p>
            <button 
              onClick={() => navigate('/create-post')}
              className="bg-[#3cab7d] text-white py-2 px-4 rounded-lg hover:bg-[#2e9a6d] transition-colors"
            >
              Create Post
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-[#3cab7d] text-[#3cab7d] disabled:opacity-50 hover:bg-green-50 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(totalPages).keys()].map((page) => (
                      <button
                        key={page + 1}
                        onClick={() => setCurrentPage(page + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          currentPage === page + 1
                            ? 'bg-[#3cab7d] text-white'
                            : 'text-[#3cab7d] hover:bg-green-50'
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-[#3cab7d] text-[#3cab7d] disabled:opacity-50 hover:bg-green-50 transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home; 