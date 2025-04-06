import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../api';
import PostCard from '../components/PostCard';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const { user, setUser } = useContext(AuthContext);
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePicture: '',
  });
  
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  
  // Determine if viewing own profile or someone else's
  const isOwnProfile = !id || (user && id === user.id);
  const profileId = isOwnProfile ? user?.id : id;
  
  useEffect(() => {
    if (!profileId) return;
    
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const profileResponse = isOwnProfile
          ? await api.getMyProfile()
          : await api.getUserProfile(profileId);
        
        const userProfile = profileResponse.data.user || profileResponse.data;
        setProfile(userProfile);
        
        // Pre-fill form data if own profile
        if (isOwnProfile) {
          setFormData({
            name: userProfile.name || '',
            email: userProfile.email || '',
            bio: userProfile.bio || '',
            profilePicture: userProfile.profilePicture || '',
          });
        }
        
        // Fetch user's posts
        const postsResponse = isOwnProfile
          ? await api.getMyPosts()
          : await api.getUserPosts(profileId);
        
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(
          error.response?.data?.message || 
          'Failed to load profile data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [profileId, isOwnProfile, user]);
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    
    try {
      setUpdateLoading(true);
      
      const updatedProfile = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
      };
      
      const { data } = await api.updateProfile(updatedProfile);
      
      // Update profile and user state
      setProfile(data);
      setUser({
        ...user,
        name: data.name,
        email: data.email,
        profilePicture: data.profilePicture,
      });
      
      // Update localStorage user
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...storedUser,
          name: data.name,
          email: data.email,
          profilePicture: data.profilePicture,
        })
      );
      
      setUpdateSuccess('Profile updated successfully');
      
      // Hide form after successful update
      setTimeout(() => {
        setShowEditForm(false);
        setUpdateSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Profile update error:', error);
      setUpdateError(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setUpdateLoading(false);
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
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#3cab7d]/20">
        <h2 className="text-2xl font-bold mb-2 text-[#3cab7d]">User Not Found</h2>
        <p className="text-gray-600 mb-4">
          The profile you're looking for doesn't exist.
        </p>
        <Link to="/" className="text-[#3cab7d] hover:text-[#2e9a6d]">
          Go back to home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-[#3cab7d]/20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="w-32 h-32 flex-shrink-0">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover border-2 border-[#3cab7d]/20"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center border-2 border-[#3cab7d]/40">
                <span className="text-[#3cab7d] text-4xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2 text-[#3cab7d]">{profile.name}</h1>
            <p className="text-gray-600 mb-3">{profile.email}</p>
            
            {profile.bio ? (
              <p className="mb-4 text-gray-700">{profile.bio}</p>
            ) : (
              <p className="text-gray-500 italic mb-4">No bio available</p>
            )}
            
            {isOwnProfile && (
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                className="bg-[#3cab7d] text-white py-2 px-4 rounded-lg hover:bg-[#2e9a6d] transition-colors"
              >
                {showEditForm ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>
        
        {/* Edit Profile Form */}
        {isOwnProfile && showEditForm && (
          <div className="mt-8 border-t border-[#3cab7d]/20 pt-6">
            <h2 className="text-xl font-bold mb-4 text-[#3cab7d]">Edit Profile</h2>
            
            {updateError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-300 mb-4">
                {updateError}
              </div>
            )}
            
            {updateSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg border border-green-300 mb-4">
                {updateSuccess}
              </div>
            )}
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block mb-1 font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
                  rows="3"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="profilePicture" className="block mb-1 font-medium text-gray-700">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
                  placeholder="Enter URL for your profile picture"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="bg-[#3cab7d] text-white py-2 px-4 rounded-lg hover:bg-[#2e9a6d] transition-colors disabled:opacity-50"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* User's Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#3cab7d]">
          {isOwnProfile ? 'Your Posts' : `${profile.name}'s Posts`}
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-[#3cab7d]/20">
            <p className="text-gray-600 mb-4">
              {isOwnProfile
                ? "You haven't created any posts yet."
                : `${profile.name} hasn't created any posts yet.`}
            </p>
            {isOwnProfile && (
              <Link
                to="/create-post"
                className="bg-[#3cab7d] text-white py-2 px-4 rounded-lg hover:bg-[#2e9a6d] transition-colors"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 