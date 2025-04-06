import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../api';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return setError('All fields are required');
    }
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError('Please enter a valid email address');
    }
    
    try {
      setLoading(true);
      const { data } = await api.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#3cab7d]">Create an Account</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 border border-red-300">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 border border-[#3cab7d]/20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              placeholder="Enter your name"
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
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              placeholder="Enter your password"
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-[#3cab7d] focus:border-[#3cab7d]"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#3cab7d] text-white py-2 px-4 rounded-lg hover:bg-[#2e9a6d] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3cab7d] hover:underline">
            Login here
          </Link>
        </p>
      </div>
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-[#3cab7d]/20">
        <h3 className="text-lg font-semibold text-[#3cab7d] mb-2">Join Our Community</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3cab7d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Create and share your own posts
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3cab7d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Engage with other community members
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3cab7d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Discover content tailored to your interests
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Register; 