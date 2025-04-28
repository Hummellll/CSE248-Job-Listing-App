
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '../services/localAuth';
import './JobListings.css';

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    title: '',
    location: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.preferences) {
      const keySkillsString = user.preferences.keySkills?.join(' ') || '';
      setSearchParams({
        title: keySkillsString,
        location: user.preferences.location || ''
      });
    }
    
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('Fetching jobs with params:', searchParams);
      
      const response = await axios.get('http://127.0.0.1:5000/api/jobs/search', {
        params: {
          title: searchParams.title,
          location: searchParams.location
        }
      });
      
      console.log('Job data:', response.data);
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      setError('Failed to fetch job listings');
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="job-listings-container">
      <div className="search-bar">
        <h2>Find Your Dream Job</h2>
        <form onSubmit={handleSearch}>
          <div className="search-inputs">
            <input
              type="text"
              name="title"
              placeholder="Job Title or Keywords"
              value={searchParams.title}
              onChange={handleSearchChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={searchParams.location}
              onChange={handleSearchChange}
            />
            <button type="submit" className="btn-search">Search</button>
          </div>
        </form>
      </div>
      
      <div className="job-list">
        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs">No jobs found. Try adjusting your search.</div>
        ) : (
          <>
            <h3>Found {jobs.length} jobs</h3>
            {jobs.map((job, index) => (
              <div className="job-card" key={job.job_id || index}>
                <div className="job-header">
                  <h3>{job.job_title}</h3>
                  <span className="company">{job.employer_name}</span>
                </div>
                <div className="job-details">
                  <span className="location">
                    {job.job_city || ''} {job.job_state || ''} {job.job_country || ''}
                  </span>
                  <span className="salary">
                    {job.job_min_salary ? 
                      `$${job.job_min_salary} - $${job.job_max_salary}` : 
                      'Salary not specified'}
                  </span>
                </div>
                <div className="job-description">
                  {job.job_description ? 
                    `${job.job_description.substring(0, 200)}...` : 
                    'No description available'}
                </div>
                <a 
                  href={job.job_apply_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <button className="btn-apply">Apply Now</button>
                </a>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default JobListings;