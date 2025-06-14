import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { alumniService } from '../services/api';
import Header from './Header';
import '../App.css';

const Directory = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const data = await alumniService.getAllAlumni();
      setAlumni(data);
      setFilteredAlumni(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      setError('Failed to fetch alumni data');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = alumni.filter(alum => 
      alum.first_name?.toLowerCase().includes(term) ||
      alum.last_name?.toLowerCase().includes(term) ||
      alum.email?.toLowerCase().includes(term) ||
      alum.department?.toLowerCase().includes(term) ||
      alum.current_company?.toLowerCase().includes(term) ||
      alum.designation?.toLowerCase().includes(term)
    );

    setFilteredAlumni(filtered);
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="profile-loading">
          <div className="profile-loading-spinner"></div>
          <p>Loading alumni directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Header />
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-lg rounded-4">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="text-primary fw-bold">Alumni Directory</h2>
                  <p className="text-muted">Connect with fellow alumni and explore their professional journeys</p>
                </div>

                <div className="search-container mb-4">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by name, email, department, company..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {filteredAlumni.map((alum) => (
                    <div key={alum._id} className="col">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <FaUser className="text-primary me-2" size={24} />
                            <h5 className="card-title mb-0">{`${alum.first_name} ${alum.last_name}`}</h5>
                          </div>
                          
                          <div className="profile-info">
                            <div className="info-item">
                              <FaEnvelope className="text-muted me-2" />
                              <span className="text-muted">Email:</span>
                              <span className="ms-2">{alum.email}</span>
                            </div>
                            
                            {alum.phone && (
                              <div className="info-item">
                                <FaPhone className="text-muted me-2" />
                                <span className="text-muted">Phone:</span>
                                <span className="ms-2">{alum.phone}</span>
                              </div>
                            )}
                            
                            {alum.department && (
                              <div className="info-item">
                                <FaBuilding className="text-muted me-2" />
                                <span className="text-muted">Department:</span>
                                <span className="ms-2">{alum.department}</span>
                              </div>
                            )}
                            
                            {alum.course && (
                              <div className="info-item">
                                <FaGraduationCap className="text-muted me-2" />
                                <span className="text-muted">Course:</span>
                                <span className="ms-2">{alum.course}</span>
                              </div>
                            )}
                            
                            {alum.current_company && (
                              <div className="info-item">
                                <FaBriefcase className="text-muted me-2" />
                                <span className="text-muted">Company:</span>
                                <span className="ms-2">{alum.current_company}</span>
                              </div>
                            )}
                            
                            {alum.designation && (
                              <div className="info-item">
                                <FaBriefcase className="text-muted me-2" />
                                <span className="text-muted">Designation:</span>
                                <span className="ms-2">{alum.designation}</span>
                              </div>
                            )}

                            {alum.current_location && (
                              <div className="info-item">
                                <FaMapMarkerAlt className="text-muted me-2" />
                                <span className="text-muted">Location:</span>
                                <span className="ms-2">{alum.current_location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredAlumni.length === 0 && (
                  <div className="alert alert-info text-center mt-4">
                    No alumni found matching your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory; 