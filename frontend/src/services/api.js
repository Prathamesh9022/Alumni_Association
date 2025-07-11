import axios from 'axios';

const API_URL = 'https://alumni-association-1b6g.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Profile services
export const profileService = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/alumni/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  updateProfile: async (data) => {
    try {
      const response = await api.put('/api/alumni/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};

// Mentorship services
export const mentorshipService = {
  getAvailableMentors: async () => {
    try {
      const response = await api.get('/api/mentorship/available-mentors');
      return response.data;
    } catch (error) {
      console.error('Get available mentors error:', error);
      throw error;
    }
  },
  getAvailableStudents: async () => {
    try {
      const response = await api.get('/api/mentorship/available-students');
      return response.data;
    } catch (error) {
      console.error('Get available students error:', error);
      throw error;
    }
  },
  getMentees: async () => {
    try {
      const response = await api.get('/api/mentorship/mentees');
      return response.data;
    } catch (error) {
      console.error('Get mentees error:', error);
      throw error;
    }
  },
  requestMentorship: async (mentorId) => {
    try {
      const response = await api.post('/api/mentorship/request', { mentorId });
      return response.data;
    } catch (error) {
      console.error('Request mentorship error:', error);
      throw error;
    }
  }
};

// Event services
export const eventService = {
  getEvents: async () => {
    try {
      const response = await api.get('/api/event');
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  },
  registerForEvent: async (eventId) => {
    try {
      const response = await api.post(`/api/event/${eventId}/register`);
      return response.data;
    } catch (error) {
      console.error('Register for event error:', error);
      throw error;
    }
  }
};

// Job services
export const jobService = {
  getJobs: async () => {
    try {
      const response = await api.get('/api/job');
      return response.data;
    } catch (error) {
      console.error('Get jobs error:', error);
      throw error;
    }
  },
  postJob: async (jobData) => {
    try {
      const response = await api.post('/api/job', jobData);
      return response.data;
    } catch (error) {
      console.error('Post job error:', error);
      throw error;
    }
  },
  applyForJob: async (jobId) => {
    try {
      const response = await api.post(`/api/job/${jobId}/apply`);
      return response.data;
    } catch (error) {
      console.error('Apply for job error:', error);
      throw error;
    }
  }
};

// Admin services
export const adminService = {
  getProfile: async () => {
    try {
      console.log('Fetching admin profile...');
      const response = await api.get('/api/admin/profile');
      console.log('Admin profile fetched successfully');
      return response.data;
    } catch (error) {
      console.error('Get admin profile error:', error);
      throw error;
    }
  },
  updateProfile: async (data) => {
    try {
      console.log('Updating admin profile...');
      const response = await api.put('/api/admin/profile', data);
      console.log('Admin profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('Update admin profile error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  }
};

// Fund services
export const fundService = {
  getFunds: async () => {
    try {
      const response = await api.get('/api/fund');
      return response.data;
    } catch (error) {
      console.error('Get funds error:', error);
      throw error;
    }
  },
  createFund: async (data) => {
    try {
      const response = await api.post('/api/fund', data);
      return response.data;
    } catch (error) {
      console.error('Create fund error:', error);
      throw error;
    }
  },
  updateFund: async (id, data) => {
    try {
      const response = await api.put(`/api/fund/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update fund error:', error);
      throw error;
    }
  },
  deleteFund: async (id) => {
    try {
      const response = await api.delete(`/api/fund/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete fund error:', error);
      throw error;
    }
  }
};

// Donation services
export const donationService = {
  getTransactions: async () => {
    try {
      const response = await api.get('/api/donation/transactions');
      return response.data;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  },
  getMyDonations: async () => {
    try {
      const response = await api.get('/api/donation/my');
      return response.data;
    } catch (error) {
      console.error('Get my donations error:', error);
      throw error;
    }
  },
  submitDonation: async (data) => {
    try {
      const response = await api.post('/api/donation/submit', data);
      return response.data;
    } catch (error) {
      console.error('Submit donation error:', error);
      throw error;
    }
  },
  notifyAdmin: async (data) => {
    try {
      const response = await api.post('/api/donation/notify', data);
      return response.data;
    } catch (error) {
      console.error('Notify admin error:', error);
      throw error;
    }
  }
};

// Alumni services
export const alumniService = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/alumni/profile');
      return response.data;
    } catch (error) {
      console.error('Get alumni profile error:', error);
      throw error;
    }
  },
  updateProfile: async (data) => {
    try {
      const response = await api.put('/api/alumni/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update alumni profile error:', error);
      throw error;
    }
  },
  getPassingYears: async () => {
    try {
      const response = await api.get('/api/alumni/passing-years');
      return response.data;
    } catch (error) {
      console.error('Get passing years error:', error);
      throw error;
    }
  },
  getAllAlumni: async () => {
    try {
      const response = await api.get('/api/alumni/all');
      return response.data;
    } catch (error) {
      console.error('Get all alumni error:', error);
      throw error;
    }
  }
};

// Student services
export const studentService = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/student/profile');
      return response.data;
    } catch (error) {
      console.error('Get student profile error:', error);
      throw error;
    }
  },
  updateProfile: async (data) => {
    try {
      const response = await api.put('/api/student/profile', data);
      return response.data;
    } catch (error) {
      console.error('Update student profile error:', error);
      throw error;
    }
  }
};

// File upload service
export const uploadService = {
  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post('/api/upload/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upload profile photo error:', error);
      throw error;
    }
  }
};

export default api; 