import React, { useState, useEffect } from 'react';
import { updatePreferences as updateUserPreferences, getCurrentUser } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [preferences, setPreferences] = useState({
    jobType: user?.preferences?.jobType || [],
    location: user?.preferences?.location || '',
    salary: user?.preferences?.salary || '',
    keySkills: user?.preferences?.keySkills || [],
    industries: user?.preferences?.industries || []
  });
  
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value
    });
  };
  
  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value.split(',').map(item => item.trim()).filter(Boolean)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserPreferences(preferences);
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        
        <div className="user-info">
          <h3>Account Information</h3>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member Since:</strong> {user && user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
        </div>
        
        <div className="preferences-section">
          <h3>Job Preferences</h3>
          {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="location">Preferred Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={preferences.location}
                onChange={handleChange}
                placeholder="e.g., New York, Remote"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="jobType">Job Types (comma-separated)</label>
              <input
                type="text"
                id="jobType"
                name="jobType"
                value={preferences.jobType.join(', ')}
                onChange={handleArrayChange}
                placeholder="e.g., Full-time, Contract, Remote"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="salary">Minimum Salary</label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={preferences.salary}
                onChange={handleChange}
                placeholder="e.g., 80000"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="keySkills">Key Skills (comma-separated)</label>
              <input
                type="text"
                id="keySkills"
                name="keySkills"
                value={preferences.keySkills.join(', ')}
                onChange={handleArrayChange}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="industries">Industries (comma-separated)</label>
              <input
                type="text"
                id="industries"
                name="industries"
                value={preferences.industries.join(', ')}
                onChange={handleArrayChange}
                placeholder="e.g., Tech, Finance, Healthcare"
              />
            </div>
            
            <button type="submit" className="save-button">Save Preferences</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;