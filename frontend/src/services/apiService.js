
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : null;
  console.log("Current user from localStorage:", user);
  return user;
};

export const isLoggedIn = () => {
  return localStorage.getItem('currentUser') !== null;
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, {
      username, email, password
    });
    
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.error || 'Registration failed';
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email, password
    });
    
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const updatePreferences = async (preferences) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  
  try {
    const response = await axios.post(`${API_URL}/users/preferences/${user.id}`, preferences);
    
    const updatedUser = { ...user, preferences: response.data };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update preferences';
  }
};

export const searchJobs = async (title, location, page = 1) => {
  try {
    

    const user = getCurrentUser();
    const userPreferences = user?.preferences || {};

    console.log("User preferences being used:", userPreferences);
    let query = title || '';
    if (userPreferences.keySkills && userPreferences.keySkills.length > 0) {
      query += ' ' + userPreferences.keySkills.join(' ');
    }
    

    const searchLocation = location || userPreferences.location || '';

    console.log("Using search query:", query);
    console.log("Using location:", searchLocation);

    const response = await axios.get(`${API_URL}/jobs/search`, {
      params: {
        title: query,
        location: searchLocation,
        salary: userPreferences.salary || '',
        jobType: userPreferences.jobType ? userPreferences.jobType.join(',') : '',
        industries: userPreferences.industries ? userPreferences.industries.join(',') : '',
        page: page,
        page_size: 20
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Job search error:", error);
    throw error.response?.data?.error || 'Failed to fetch jobs';
  }
};
export const summarizeJobDescription = async (description) => {
  try {
    console.log("Sending description to summarize, length:", description?.length || 0);
    
    if (!description) {
      console.error("Description is empty or undefined");
      return "No description available to summarize.";
    }
    
    const response = await axios.post(`${API_URL}/jobs/summarize`, {
      description: description
    });
    
    console.log("Summary response:", response.data);
    return response.data.summary;
  } catch (error) {
    console.error('Failed to summarize job description:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    return 'Unable to generate summary. Please try again later.';
  }
};


export const isAuthenticated = isLoggedIn;