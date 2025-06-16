import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaUser, FaGraduationCap, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCode, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import Header from './Header';
import '../App.css'

const Directory1 = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsAdmin(user && user.role === 'admin');
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const url = isAdmin ? 'https://alumni-2tzp.onrender.com/api/admin/alumni' : 'https://alumni-2tzp.onrender.com/api/alumni/all';
      const token = localStorage.getItem('token');
      const response = await axios.get(url, isAdmin ? { headers: { Authorization: `Bearer ${token}` } } : {});
      const alumniData = response.data.map(alum => ({
        ...alum,
        fullName: `${alum.first_name} ${alum.last_name}`.trim(),
        currentCompany: alum.experience && alum.experience.length > 0 ? alum.experience[0].company : 'Not specified',
        currentRole: alum.experience && alum.experience.length > 0 ? alum.experience[0].position : 'Not specified',
        location: alum.current_address || 'Not specified'
      }));
      
      setAlumni(alumniData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch alumni data');
      setLoading(false);
      console.error('Error fetching alumni:', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://alumni-2tzp.onrender.com/api/admin/alumni/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchAlumni();
    } catch (err) {
      alert('Failed to approve alumni');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://alumni-2tzp.onrender.com/api/admin/alumni/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchAlumni();
    } catch (err) {
      alert('Failed to reject alumni');
    }
  };

  const handleDeleteAlumni = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alumni?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://alumni-2tzp.onrender.com/api/admin/alumni/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAlumni();
    } catch (err) {
      alert('Failed to delete alumni');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="text-primary mb-4">Alumni Directory</h2>
            <div className="row">
              {alumni.map(alum => (
                <div className="col-md-6 col-lg-4 mb-4" key={alum._id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="text-center mb-3">
                        {alum.profile ? (
                          <img src={alum.profile} alt={alum.fullName} className="rounded-circle mb-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        ) : (
                          <div className="rounded-circle bg-light mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                            <FaUser size={40} className="text-muted" />
                          </div>
                        )}
                      </div>
                      <h5 className="card-title">{alum.fullName}</h5>
                      <p className="card-text mb-1"><FaEnvelope className="me-2" />{alum.email}</p>
                      <p className="card-text mb-1"><FaBriefcase className="me-2" />{alum.currentCompany}</p>
                      <p className="card-text mb-1"><FaGraduationCap className="me-2" />Batch: {alum.passing_year}</p>
                      <p className="card-text mb-1"><FaMapMarkerAlt className="me-2" />{alum.location}</p>
                      <p className="card-text mb-1">Phone: {alum.phone}</p>
                      <p className="card-text mb-1">DOB: {alum.dob ? new Date(alum.dob).toLocaleDateString() : '-'}</p>
                      <p className="card-text mb-1">Gender: {alum.gender}</p>
                      <p className="card-text mb-1">Department: {alum.department}</p>
                      <p className="card-text mb-1">Course: {alum.course}</p>
                      <p className="card-text mb-1">Current Company: {alum.current_company}</p>
                      <p className="card-text mb-1">Designation: {alum.designation}</p>
                      <p className="card-text mb-1">Current Location: {alum.current_location}</p>
                      <div className="mb-2">Skills: {(alum.skillset || []).join(', ')}</div>
                      <div className="mb-2">Projects: {(alum.projects || []).map(p => p.title).join(', ')}</div>
                      <div className="mb-2">Achievements: {(alum.achievements || []).map(a => a.title).join(', ')}</div>
                      <div className="mb-2">Education: {(alum.education || []).map(e => e.institution).join(', ')}</div>
                      {isAdmin && (
                        <div className="d-flex align-items-center gap-3 mt-3" style={{ flexWrap: 'wrap' }}>
                          <span className={`badge rounded-pill ${alum.isApproved ? 'bg-success' : 'bg-warning text-dark'}`} style={{ minWidth: 100, fontSize: '1rem', padding: '0.6em 1.2em', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>{alum.isApproved ? 'Approved' : 'Pending'}</span>
                          {!alum.isApproved && (
                            <button className="btn btn-primary btn-lg" style={{ minWidth: 120, background: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 100%)', border: 'none', borderRadius: '2em', boxShadow: '0 2px 8px rgba(26,42,108,0.10)', fontWeight: 600, transition: 'all 0.2s' }} onClick={() => handleApprove(alum._id)}>
                              <FaCheck className="me-2" /> Approve
                            </button>
                          )}
                          {!alum.isApproved && (
                            <button className="btn btn-danger btn-lg" style={{ minWidth: 120, borderRadius: '2em', boxShadow: '0 2px 8px rgba(178,31,31,0.10)', fontWeight: 600, transition: 'all 0.2s' }} onClick={() => handleReject(alum._id)}>
                              <FaTimes className="me-2" /> Reject
                            </button>
                          )}
                          <button className="btn btn-outline-danger btn-lg" style={{ minWidth: 120, borderRadius: '2em', fontWeight: 600, transition: 'all 0.2s' }} onClick={() => handleDeleteAlumni(alum._id)}>
                            <FaTrash className="me-2" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Directory1; 