import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { jobService } from '../services/api';
import Header from './Header';
import './CommonStyles.css';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getJobs();
      setJobs(response || []);
      setFilteredJobs(response || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div className="content">
          <div className="loading">Loading jobs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Header />
        <div className="content">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <div className="content">
        <div className="jobs-header">
          <h2>
            <FaBriefcase className="me-2" />
            Available Jobs
          </h2>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <div className="company">
                  <FaBuilding className="me-2" />
                  {job.name}
                </div>
              </div>

              <div className="job-details">
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span><strong>Location:</strong> {job.location}</span>
                </div>

                <div className="detail-item">
                  <FaMoneyBillWave className="detail-icon" />
                  <span><strong>Salary:</strong> {job.salary}</span>
                </div>

                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <span><strong>Application Deadline:</strong> {new Date(job.expireDate).toLocaleDateString()}</span>
                </div>

                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <span><strong>Posted by:</strong> {job.postedBy}</span>
                </div>
              </div>

              <div className="job-description">
                <h4>Description</h4>
                <p>{job.description}</p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="job-requirements">
                  <h4>Requirements</h4>
                  <ul>
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="job-actions">
                <a 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="no-jobs">
            No jobs found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;
