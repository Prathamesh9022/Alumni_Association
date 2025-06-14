import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaGraduationCap, FaBriefcase, FaTools, FaSave, FaIdCard, FaTrash, FaPlus, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../services/api';
import Header from './Header';
import './CommonStyles.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [experience, setExperience] = useState([{
    type: 'Internship',
    company: '',
    position: '',
    duration: '',
    description: ''
  }]);
  const [skills, setSkills] = useState([""]);
  const [education, setEducation] = useState([
    {
      type: '10th',
      institution: '',
      board: '',
      year: '',
      grade: '',
      percentage: ''
    },
    {
      type: '12th',
      institution: '',
      board: '',
      year: '',
      grade: '',
      percentage: ''
    }
  ]);
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    current_year: '',
    address: '',
    goals: '',
    interests: []
  });

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'student') {
      navigate('/auth');
      return;
    }

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const maxPassingYear = `${currentYear}-${currentMonth}`;
  const minPassingYear = "2003-01";
  const maxDob = new Date(currentYear - 20, 0, 1).toISOString().split("T")[0];
  const minDob = "1997-01-01";

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);  // Set the image as base64
      reader.readAsDataURL(file);  // Read the file as data URL (base64 encoded)
    }
  };

  const handleChange = (setter, list, index, field, value) => {
    const updated = [...list];
    if (field === 'skill') {
      updated[index] = value; // For skills, just store the string value directly
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setter(updated);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddField = (setter, list, template) => setter([...list, template]);

  const handleRemoveField = (setter, list, index) => {
    const updatedList = [...list];
    updatedList.splice(index, 1);
    setter(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const profileData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        current_year: formData.current_year,
        address: formData.address,
        goals: formData.goals,
        interests: formData.interests,
        experience: experience
          .filter(exp => exp.company && exp.position && exp.duration)
          .map(exp => ({
            type: exp.type,
            company: exp.company,
            position: exp.position,
            duration: exp.duration,
            description: exp.description || ''
          })),
        skills: skills.filter(skill => typeof skill === 'string' && skill.trim() !== ''),
        education: education
          .filter(edu => edu.institution && edu.board && edu.year && edu.grade && edu.percentage)
          .map(edu => ({
            type: edu.type,
            institution: edu.institution,
            board: edu.board,
            year: parseInt(edu.year),
            grade: edu.grade,
            percentage: parseFloat(edu.percentage)
          }))
      };

      const response = await api.put('/student/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        alert("Profile updated successfully!");
        setProfileCompleted(true);
        const updatedUser = { ...userData, profileCompleted: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        navigate('/home1');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      
      // Check if this is a new user
      const isNewUser = !data.profileCompleted && (!data.experience || data.experience.length === 0);
      
      if (isNewUser) {
        // Initialize with empty data for new users
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          department: '',
          current_year: '',
          address: '',
          goals: '',
          interests: []
        });
        setExperience([{
          type: 'Internship',
          company: '',
          position: '',
          duration: '',
          description: ''
        }]);
        setSkills(['']);
        setEducation([
          {
            type: '10th',
            institution: '',
            board: '',
            year: '',
            grade: '',
            percentage: ''
          },
          {
            type: '12th',
            institution: '',
            board: '',
            year: '',
            grade: '',
            percentage: ''
          }
        ]);
      } else {
        // Use existing data for returning users
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          current_year: data.current_year || '',
          address: data.address || '',
          goals: data.goals || '',
          interests: data.interests || []
        });
        setProfilePic(data.profile || null);
        setExperience(data.experience || [{
          type: 'Internship',
          company: '',
          position: '',
          duration: '',
          description: ''
        }]);
        setSkills(data.skills || ['']);
        setEducation(data.education || [
          {
            type: '10th',
            institution: '',
            board: '',
            year: '',
            grade: '',
            percentage: ''
          },
          {
            type: '12th',
            institution: '',
            board: '',
            year: '',
            grade: '',
            percentage: ''
          }
        ]);
      }
      
      setProfileCompleted(data.profileCompleted || false);
      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 404) {
        // Handle new user case
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          department: '',
          current_year: '',
          address: '',
          goals: '',
          interests: []
        });
        setExperience([{
          type: 'Internship',
          company: '',
          position: '',
          duration: '',
          description: ''
        }]);
        setSkills(['']);
        setEducation([
          {
            type: '10th',
            institution: '',
            board: '',
            year: '',
            grade: '',
            percentage: ''
          },
          {
            type: '12th',
            institution: '',
            board: '',
            year: '',
            grade: '',
            percentage: ''
          }
        ]);
        setProfileCompleted(false);
      } else {
        alert(error.response?.data?.error || "Failed to fetch profile");
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!userData) {
    return <div className="alert alert-warning">Profile not found</div>;
  }

  return (
    <div className="container">
      <Header />
      <div className="content">
        <div className="profile-header">
          <h2>
            <FaUser className="me-2" />
            Student Profile
          </h2>
          
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleFieldChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleFieldChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFieldChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFieldChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleFieldChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Current Year</label>
              <input
                type="number"
                name="current_year"
                value={formData.current_year}
                onChange={handleFieldChange}
                className="form-control"
                required
                min="1"
                max="4"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleFieldChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Goals</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleFieldChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Interests (comma-separated)</label>
              <input
                type="text"
                name="interests"
                value={formData.interests.join(', ')}
                onChange={(e) => {
                  const interests = e.target.value.split(',').map(item => item.trim());
                  setFormData(prev => ({
                    ...prev,
                    interests
                  }));
                }}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="profile-card">
            <div className="profile-header">
              <h3>{`${userData.first_name} ${userData.last_name}`}</h3>
              <div className="department">
                <FaGraduationCap className="me-2" />
                {userData.department}
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <span>{userData.email}</span>
              </div>

              {userData.phone && (
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <span>{userData.phone}</span>
                </div>
              )}

              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <span>Year {userData.current_year}</span>
              </div>

              {userData.address && (
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{userData.address}</span>
                </div>
              )}
            </div>

            {userData.goals && (
              <div className="profile-section">
                <h4>Goals</h4>
                <p>{userData.goals}</p>
              </div>
            )}

            {userData.interests && userData.interests.length > 0 && (
              <div className="profile-section">
                <h4>Interests</h4>
                <div className="interests-list">
                  {userData.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
