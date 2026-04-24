import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Let the browser set the Content-Type with boundary for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// About
export const getAbout = () => api.get('/about');
export const updateAbout = (data) => api.put('/about', data, { headers: { 'Content-Type': 'multipart/form-data' } });

// Projects
export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProject = (id, data) => api.put(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Experience
export const getExperience = () => api.get('/experience');
export const createExperience = (data) => api.post('/experience', data);
export const updateExperience = (id, data) => api.put(`/experience/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experience/${id}`);

// Achievements
export const getAchievements = () => api.get('/achievements');
export const createAchievement = (data) => api.post('/achievements', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAchievement = (id, data) => api.put(`/achievements/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteAchievement = (id) => api.delete(`/achievements/${id}`);

// Courses
export const getCourses = () => api.get('/courses');
export const createCourse = (data) => api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Navbar
export const getNavbar = () => api.get('/navbar');
export const createNavLink = (data) => api.post('/navbar', data);
export const updateNavLink = (id, data) => api.put(`/navbar/${id}`, data);
export const deleteNavLink = (id) => api.delete(`/navbar/${id}`);

// Social
export const getSocial = () => api.get('/social');
export const upsertSocial = (data) => api.post('/social', data);
export const updateSocial = (id, data) => api.put(`/social/${id}`, data);

// Media
export const getMedia = () => api.get('/media');
export const getLogo = () => api.get('/media/logo');
export const uploadMedia = (data) => api.post('/media', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMedia = (id) => api.delete(`/media/${id}`);

// Contact
export const getMessages = () => api.get('/contact');
export const sendMessage = (data) => api.post('/contact', data);
export const markMessageRead = (id) => api.put(`/contact/${id}/read`);
export const deleteMessage = (id) => api.delete(`/contact/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSetting = (data) => api.post('/settings', data);
export const bulkUpdateSettings = (settings) => api.put('/settings/bulk', { settings });

export default api;

