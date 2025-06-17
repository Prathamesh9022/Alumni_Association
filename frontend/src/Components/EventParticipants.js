import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUsers, 
  FaArrowLeft, 
  FaDownload, 
  FaEnvelope, 
  FaUserGraduate, 
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaBuilding,
  FaBriefcase
} from 'react-icons/fa';
import api from '../services/api';
import Header from './Header';
import './CommonStyles.css';

const EventParticipants = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        // Fetch event details
        const eventResponse = await api.get(`/event/${eventId}`);
        setEvent(eventResponse.data);

        // Fetch participants
        const participantsResponse = await api.get(`/event/${eventId}/participants`);
        setParticipants(participantsResponse.data);
      } catch (err) {
        console.error('Error fetching event participants:', err);
        let errorMessage = 'Failed to load participants';
        
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (err.response) {
          switch (err.response.status) {
            case 404:
              errorMessage = 'Event not found. The event may have been deleted or the URL is incorrect.';
              break;
            case 403:
              errorMessage = 'You are not authorized to view participants for this event.';
              break;
            case 401:
              errorMessage = 'Please log in to view event participants.';
              break;
            default:
              errorMessage = err.response.data?.error || 'An error occurred while loading participants.';
          }
        } else if (err.request) {
          errorMessage = 'No response from server. Please try again later.';
        } else {
          errorMessage = err.message || 'An unexpected error occurred.';
        }
        
        setError(errorMessage);
        
        // If unauthorized or not found, navigate back to events page after a delay
        if (err.response?.status === 403 || err.response?.status === 404) {
          setTimeout(() => {
            navigate('/events');
          }, 3000);
        } else if (err.response?.status === 401) {
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndParticipants();
  }, [eventId, navigate]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to export participants to CSV
  const exportToCSV = () => {
    if (!participants.length || !event) return;

    // Prepare CSV content
    const headers = ['Name', 'Email', 'Type', 'Registration Date'];
    
    const csvRows = [
      // Title row with event information
      [`Participants for: ${event.title}`],
      [`Event Date: ${formatDate(event.date)}`],
      [''], // Empty row for spacing
      headers, // Header row
      
      // Data rows
      ...participants.map(p => [
        p.name,
        p.email,
        p.participantModel === 'Alumni' ? 'Alumni' : 'Student',
        formatDate(p.registrationDate)
      ])
    ];
    
    // Convert to CSV format
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `participants_${event.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
          {error.includes('authorized') && (
            <p className="mt-2 mb-0">Redirecting back to events page...</p>
          )}
        </div>
        <div className="mt-3">
          <Link to="/events" className="btn btn-primary">
            <FaArrowLeft className="me-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Event not found
        </div>
        <div className="mt-3">
          <Link to="/events" className="btn btn-primary">
            <FaArrowLeft className="me-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <div className="content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">
            <FaUsers className="me-2" />
            Event Participants
          </h2>
          
          <Link to="/events" className="btn btn-outline-primary">
            <FaArrowLeft className="me-2" />
            Back to Events
          </Link>
        </div>
        
        <div className="event-details">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <div className="event-meta">
            <span><FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}</span>
            <span><FaClock /> {event.time}</span>
            <span><FaMapMarkerAlt /> {event.location}</span>
          </div>
        </div>

        <div className="participants-section">
          <h3>
            <FaUsers /> Participants ({participants.length})
          </h3>

          <div className="participants-grid">
            {participants.map((participant) => (
              <div key={participant._id} className="participant-card">
                <div className="participant-header">
                  <FaUser className="participant-icon" />
                  <h4>{`${participant.first_name} ${participant.last_name}`}</h4>
                </div>
                
                <div className="participant-details">
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span>{participant.email}</span>
                  </div>
                  
                  {participant.phone && (
                    <div className="detail-item">
                      <FaPhone className="detail-icon" />
                      <span>{participant.phone}</span>
                    </div>
                  )}
                  
                  {participant.current_company && (
                    <div className="detail-item">
                      <FaBuilding className="detail-icon" />
                      <span>{participant.current_company}</span>
                    </div>
                  )}
                  
                  {participant.designation && (
                    <div className="detail-item">
                      <FaBriefcase className="detail-icon" />
                      <span>{participant.designation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {participants.length === 0 && (
            <div className="no-participants">
              No participants have registered for this event yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventParticipants; 