import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaUser, FaFilter } from 'react-icons/fa';
import { jobService } from '../services/api';
import Header from './Header';
import './CommonStyles.css';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    name: '',
    location: '',
    type: '',
    salary: '',
    expireDate: ''
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => {
      return (
        (!filters.title || job.title?.toLowerCase().includes(filters.title.toLowerCase())) &&
        (!filters.name || job.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.type || job.type?.toLowerCase() === filters.type.toLowerCase()) &&
        (!filters.salary || job.salary?.toLowerCase().includes(filters.salary.toLowerCase())) &&
        (!filters.expireDate || new Date(job.expireDate).toLocaleDateString().includes(filters.expireDate))
      );
    });
    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      name: '',
      location: '',
      type: '',
      salary: '',
      expireDate: ''
    });
  };

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
          
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="me-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-section mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  name="title"
                  value={filters.title}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Search by job title"
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Search by company name"
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Search by location"
                />
              </div>
              <div className="col-md-4">
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  name="salary"
                  value={filters.salary}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Search by salary"
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  name="expireDate"
                  value={filters.expireDate}
                  onChange={handleFilterChange}
                  className="form-control"
                />
              </div>
              <div className="col-12">
                <button 
                  className="btn btn-secondary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

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
