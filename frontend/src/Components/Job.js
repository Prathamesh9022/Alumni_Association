import React, { useState, useEffect } from 'react';
import { 
  FaBriefcase, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaUser, 
  FaFilter, 
  FaSearch,
  FaTimes,
  FaExternalLinkAlt,
  FaClock,
  FaStar,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { jobService } from '../services/api';
import Header from './Header';
import './Job.css';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    name: '',
    location: '',
    type: '',
    salary: ''
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => {
      const matchesSearch = !searchQuery || 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilters = 
        (!filters.title || job.title?.toLowerCase().includes(filters.title.toLowerCase())) &&
        (!filters.name || job.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.type || job.type?.toLowerCase() === filters.type.toLowerCase()) &&
        (!filters.salary || job.salary?.toLowerCase().includes(filters.salary.toLowerCase()));

      return matchesSearch && matchesFilters;
    });
    setFilteredJobs(filtered);
  }, [filters, jobs, searchQuery]);

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
      salary: ''
    });
    setSearchQuery('');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const toggleDescription = (jobId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div className="content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading amazing opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Header />
        <div className="content">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchJobs}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <div className="content">
        {/* Hero Section */}
        <div className="jobs-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <FaBriefcase className="hero-icon" />
              Discover Your Next Career Move
            </h1>
            <p className="hero-subtitle">
              Explore exciting opportunities from our alumni network and find the perfect role for your skills and aspirations
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                placeholder="Search jobs, companies, or locations..."
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="filter-icon" />
              {showFilters ? 'Hide Filters' : 'Advanced Filters'}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="jobs-stats">
          <div className="stat-card">
            <div className="stat-number">{filteredJobs.length}</div>
            <div className="stat-label">Available Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{jobs.length - filteredJobs.length}</div>
            <div className="stat-label">Filtered Out</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{jobs.filter(job => new Date(job.expireDate) > new Date()).length}</div>
            <div className="stat-label">Active Listings</div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="filters-section">
            <div className="filters-header">
              <h3>Refine Your Search</h3>
              <button className="clear-filters-btn" onClick={clearFilters}>
                <FaTimes />
                Clear All
              </button>
            </div>
            
            <div className="filters-grid">
              <div className="filter-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={filters.title}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              
              <div className="filter-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="e.g., Google, Microsoft"
                />
              </div>
              
              <div className="filter-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="e.g., New York, Remote"
                />
              </div>
              
              <div className="filter-group">
                <label>Job Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Salary Range</label>
                <input
                  type="text"
                  name="salary"
                  value={filters.salary}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="e.g., $50k-$100k"
                />
              </div>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <div className="job-title-section">
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-type-badge">
                    {job.type || 'Full-time'}
                  </div>
                </div>
                
                <div className="company-info">
                  <FaBuilding className="company-icon" />
                  <span className="company-name">{job.name}</span>
                </div>
              </div>

              <div className="job-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{job.location || 'Location not specified'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaMoneyBillWave className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Salary:</span>
                      <span className="detail-value">{job.salary || 'Salary not specified'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Deadline:</span>
                      <span className="detail-value">{job.expireDate ? formatDate(job.expireDate) : 'No deadline set'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Posted:</span>
                      <span className="detail-value">{getTimeAgo(job.createdAt || job.expireDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="job-description">
                <p>
                  {expandedDescriptions[job._id] 
                    ? job.description 
                    : truncateDescription(job.description)
                  }
                </p>
                {job.description && job.description.length > 150 && (
                  <button 
                    className="read-more-btn"
                    onClick={() => toggleDescription(job._id)}
                  >
                    {expandedDescriptions[job._id] ? (
                      <>
                        <FaChevronUp />
                        Read Less
                      </>
                    ) : (
                      <>
                        <FaChevronDown />
                        Read More
                      </>
                    )}
                  </button>
                )}
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="job-requirements">
                  <h4>Requirements</h4>
                  <ul className="requirements-list">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="job-footer">
                <div className="posted-by">
                  <FaUser className="user-icon" />
                  <span>Posted by {job.postedBy}</span>
                </div>
                
                <a 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="apply-btn"
                >
                  <FaExternalLinkAlt />
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* No Jobs Found */}
        {filteredJobs.length === 0 && (
          <div className="no-jobs-container">
            <div className="no-jobs-content">
              <div className="no-jobs-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>
                {searchQuery || Object.values(filters).some(f => f) 
                  ? "Try adjusting your search criteria or filters"
                  : "Check back later for new opportunities"
                }
              </p>
              {(searchQuery || Object.values(filters).some(f => f)) && (
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;
