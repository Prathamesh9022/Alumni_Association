import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import api from '../services/api';
import Header from './Header';
import './CommonStyles.css';

const Mentorship2 = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMentees, setFilteredMentees] = useState([]);

  useEffect(() => {
    fetchMentees();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMentees(mentees);
    } else {
      const filtered = mentees.filter(mentee => 
        mentee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMentees(filtered);
    }
  }, [searchTerm, mentees]);

  const fetchMentees = async () => {
    try {
      const response = await api.get('/mentorship/mentees');
      setMentees(response.data);
      setFilteredMentees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      setError('Failed to fetch mentees');
      setLoading(false);
    }
  };

  const handleEndMentorship = async (menteeId) => {
    if (!window.confirm('Are you sure you want to end this mentorship?')) {
      return;
    }

    try {
      await api.post('/mentorship/end', { menteeId });
      setMentees(mentees.filter(mentee => mentee._id !== menteeId));
      setFilteredMentees(filteredMentees.filter(mentee => mentee._id !== menteeId));
      alert('Mentorship ended successfully');
    } catch (error) {
      console.error('Error ending mentorship:', error);
      alert('Failed to end mentorship. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <Header />
      <div className="content">
        <div className="mentees-header">
          <h2>
            <FaUser className="me-2" />
            My Mentees
          </h2>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Search mentees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div className="mentees-grid">
          {filteredMentees.map((mentee) => (
            <div key={mentee._id} className="mentee-card">
              <div className="mentee-header">
                <h3>{`${mentee.first_name} ${mentee.last_name}`}</h3>
                <div className="department">
                  <FaGraduationCap className="me-2" />
                  {mentee.department}
                </div>
              </div>

              <div className="mentee-details">
                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <span>{mentee.email}</span>
                </div>

                {mentee.phone && (
                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <span>{mentee.phone}</span>
                  </div>
                )}

                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <span>Roll Number: {mentee.roll_number}</span>
                </div>

                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <span>Year: {mentee.year}</span>
                </div>
              </div>

              <div className="mentee-goals">
                <h4>Goals:</h4>
                <p>{mentee.goals || 'No specific goals listed.'}</p>
              </div>

              <div className="mentee-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = `/chat/${mentee._id}`}
                >
                  Start Chat
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleEndMentorship(mentee._id)}
                >
                  End Mentorship
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMentees.length === 0 && (
          <div className="no-mentees">
            No mentees found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentorship2; 