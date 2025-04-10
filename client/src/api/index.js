import axios from 'axios';


const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Add token to requests that require authentication
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  return req;
});

// Auth API
export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const getCurrentUser = () => API.get('/auth/me');

// Post API
export const getPosts = (page = 1, limit = 8, tag) => {
  let url = `/posts?page=${page}&limit=${limit}`;
  if (tag) url += `&tag=${tag}`;
  return API.get(url);
};
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (postData) => API.post('/posts', postData);
export const updatePost = (id, postData) => API.put(`/posts/${id}`, postData);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.post(`/posts/${id}/like`);
export const commentPost = (id, text) => API.post(`/posts/${id}/comments`, { text });
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);
export const getMyPosts = () => API.get('/posts/my-posts/all');
export const getPopularTags = () => API.get('/posts/tags/popular');


// User API
export const getUserProfile = (id) => API.get(`/users/profile/${id}`);
export const getMyProfile = () => API.get('/users/profile');
export const updateProfile = (userData) => API.put('/users/profile', userData);
export const getUsers = () => API.get('/users'); 