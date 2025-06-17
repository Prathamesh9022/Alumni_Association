import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  FaBriefcase,
  FaSpinner,
  FaExclamationTriangle
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
        const eventResponse = await api.get(`/api/event/${eventId}`);
        setEvent(eventResponse.data);

        // Fetch participants
        const participantsResponse = await api.get(`/api/event/${eventId}/participants`);
        setParticipants(participantsResponse.data.participants || []);
      } catch (err) {
        console.error('Error fetching event participants:', err);
        let errorMessage = 'Failed to load participants';
        
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (err.response) {
          switch (err.response.status) {
            case 404:
              errorMessage = 'This event no longer exists or has been removed.';
              navigate('/events');
              break;
            case 403:
              errorMessage = 'You are not authorized to view participants for this event.';
              setTimeout(() => navigate('/events'), 3000);
              break;
            case 401:
              errorMessage = 'Please log in to view event participants.';
              setTimeout(() => navigate('/login'), 3000);
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
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndParticipants();
  }, [eventId, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const exportToCSV = () => {
    if (!participants.length || !event) return;

    const headers = ['Name', 'Email', 'Type', 'Registration Date'];
    const csvRows = [
      [`Participants for: ${event.title}`],
      [`Event Date: ${formatDate(event.date)}`],
      [''],
      headers,
      ...participants.map(p => [
        p.name,
        p.email,
        p.participantModel === 'Alumni' ? 'Alumni' : 'Student',
        formatDate(p.registrationDate)
      ])
    ];
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
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
          <FaExclamationTriangle className="me-2" />
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
          <FaExclamationTriangle className="me-2" />
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
    <>
      <Header />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">
            <FaUsers className="me-2" />
            Event Participants
          </h2>
          
          <div className="d-flex gap-2">
            <button 
              onClick={exportToCSV}
              className="btn btn-outline-primary"
              disabled={!participants.length}
            >
              <FaDownload className="me-2" />
              Export to CSV
            </button>
            <Link to="/events" className="btn btn-outline-secondary">
              <FaArrowLeft className="me-2" />
              Back to Events
            </Link>
          </div>
        </div>
        
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-3">{event.title}</h3>
            <p className="card-text text-muted mb-3">{event.description}</p>
            <div className="d-flex flex-wrap gap-3">
              <div className="d-flex align-items-center">
                <FaCalendarAlt className="text-primary me-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="d-flex align-items-center">
                <FaClock className="text-primary me-2" />
                <span>{event.time}</span>
              </div>
              {event.venue && (
                <div className="d-flex align-items-center">
                  <FaMapMarkerAlt className="text-primary me-2" />
                  <span>{event.venue}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h3 className="mb-0">
              <FaUsers className="me-2 text-primary" />
              Participants ({participants.length})
            </h3>
          </div>
          <div className="card-body">
            {participants.length > 0 ? (
              <div className="row g-4">
                {participants.map((participant) => (
                  <div key={participant._id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="participant-avatar me-3">
                            <FaUser className="text-primary" size={24} />
                          </div>
                          <h5 className="card-title mb-0">
                            {`${participant.first_name} ${participant.last_name}`}
                          </h5>
                        </div>
                        
                        <div className="participant-details">
                          <div className="detail-item mb-2">
                            <FaEnvelope className="text-primary me-2" />
                            <span>{participant.email}</span>
                          </div>
                          
                          {participant.phone && (
                            <div className="detail-item mb-2">
                              <FaPhone className="text-primary me-2" />
                              <span>{participant.phone}</span>
                            </div>
                          )}
                          
                          {participant.current_company && (
                            <div className="detail-item mb-2">
                              <FaBuilding className="text-primary me-2" />
                              <span>{participant.current_company}</span>
                            </div>
                          )}
                          
                          {participant.designation && (
                            <div className="detail-item">
                              <FaBriefcase className="text-primary me-2" />
                              <span>{participant.designation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <FaUsers className="text-muted mb-3" size={48} />
                <p className="text-muted mb-0">No participants have registered for this event yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventParticipants; 