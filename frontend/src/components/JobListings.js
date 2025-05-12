import React, { useState, useEffect } from 'react';
import { searchJobs, getCurrentUser, summarizeJobDescription } from '../services/apiService';
import './JobListings.css';

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    title: '',
    location: ''
  });
  const [page, setPage] = useState(1);
  const [summaries, setSummaries] = useState({});
  const [summarizing, setSummarizing] = useState({});
  const [viewingFullDescription, setViewingFullDescription] = useState({});
  

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (pageNum = 1) => {
    try {
      setLoading(true);
      setPage(pageNum);
      
      const jobResults = await searchJobs(
        searchParams.title, 
        searchParams.location,
        pageNum
      );
      
      setJobs(jobResults);
      setLoading(false);
    } catch (err) {
      setError('Error loading jobs: ' + err.toString());
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };


  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1); 
  };
  

  const nextPage = () => fetchJobs(page + 1);
  const prevPage = () => fetchJobs(Math.max(1, page - 1));


  const user = getCurrentUser();
  const usingPreferences = !!user?.preferences;

  const handleSummarize = async (index, description) => {
    if (summarizing[index] || summaries[index]) return;
    
    if (!description) {
      console.error("No description available for job at index", index);
      setSummaries(prev => ({ ...prev, [index]: "No description available to summarize." }));
      return;
    }
    
    try {
      console.log("Summarizing job description at index", index, "length:", description.length);
      setSummarizing(prev => ({ ...prev, [index]: true }));
      const summary = await summarizeJobDescription(description);
      setSummaries(prev => ({ ...prev, [index]: summary }));
    } catch (error) {
      console.error('Error summarizing job:', error);
      setSummaries(prev => ({ ...prev, [index]: "Error generating summary." }));
    } finally {
      setSummarizing(prev => ({ ...prev, [index]: false }));
    }
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
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={searchParams.location}
              onChange={handleChange}
            />
            <button type="submit" className="btn-search">Search</button>
          </div>
        </form>
        {usingPreferences && (
          <p className="preferences-note">Your saved preferences are included in search results</p>
        )}
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
                <div className="job-description-container">
                  <p className="job-description">
                    {viewingFullDescription[index] ? 
                      job.job_description : 
                      (summaries[index] ? 
                        summaries[index] : 
                        (job.job_description ? 
                          `${job.job_description.substring(0, 200)}...` : 
                          'No description available'))}
                  </p>
                  
                  <div className="description-buttons">
                    {!summaries[index] && !viewingFullDescription[index] && (
                      <button 
                        className="btn-summarize"
                        onClick={() => handleSummarize(index, job.job_description)}
                        disabled={summarizing[index]}
                      >
                        {summarizing[index] ? 'Summarizing...' : 'Show Key Requirements'}
                      </button>
                    )}
                    
                    <button 
                      className="btn-summarize"
                      onClick={() => setViewingFullDescription(prev => ({
                        ...prev, 
                        [index]: !prev[index]
                      }))}
                      style={{ marginLeft: '10px' }}
                    >
                      {viewingFullDescription[index] ? 'Show Less' : 'View Full Description'}
                    </button>
                  </div>
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
            
            <div className="pagination">
              <button onClick={prevPage} disabled={page === 1}>Previous</button>
              <span>Page {page}</span>
              <button onClick={nextPage} disabled={jobs.length < 20}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JobListings;