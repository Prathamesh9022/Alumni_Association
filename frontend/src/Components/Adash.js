import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaGraduationCap, FaBriefcase, FaSave, FaIdCard, FaTrash, FaPlus, FaTrophy, FaProjectDiagram, FaCode } from 'react-icons/fa';
import Header from './Header';
import axiosInstance from '../utils/axiosConfig';
import './Adash.css';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/api';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [experience, setExperience] = useState([{
    company: '',
    position: '',
    duration: '',
    description: ''
  }]);
  const [skills, setSkills] = useState([""]);
  const [education, setEducation] = useState([
    {
      type: '12th',
      institution: '',
      board: '',
      year: '',
      grade: '',
      percentage: ''
    },
    {
      type: 'Graduation',
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
  const [isEditing, setIsEditing] = useState(true);
  const [projects, setProjects] = useState([{
    title: '',
    description: '',
    technologies: '',
    duration: '',
    link: ''
  }]);
  const [achievements, setAchievements] = useState([{
    type: 'sports',
    title: '',
    description: '',
    date: '',
    organization: ''
  }]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'alumni') {
      navigate('/auth');
      return;
    }

    // Check if we have profile data from navigation state
    if (location.state?.profileData) {
      const data = location.state.profileData;
      setUserData(data);
      setEmail(data.email);
      setProfilePic(data.profile);
      setExperience(data.experience || []);
      setSkills(data.skillset || data.skills || [""]);
      setEducation(data.education || []);
      setIsEditing(true);
    } else {
      fetchUserData();
    }
  }, [navigate, location]);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user?.email; // Get email from stored user data
      
      const response = await axiosInstance.get('/api/alumni/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      
      // Ensure email is set even if API doesn't return it
      if (!data.email && userEmail) {
        data.email = userEmail;
      }
      
      // Check if this is a new user
      const isNewUser = !data.profileCompleted && (!data.experience || data.experience.length === 0);
      
      if (isNewUser) {
        // Initialize with empty data for new users
        setUserData({
          ...data,
          email: data.email || userEmail, // Ensure email is included
          department: 'Information Technology',
          course: 'B. Tech. Information Technology',
          experience: [{
            company: '',
            position: '',
            duration: '',
            description: ''
          }],
          skills: [''],
          education: [
            {
              type: '12th',
              institution: '',
              board: '',
              year: '',
              grade: '',
              percentage: ''
            },
            {
              type: 'Graduation',
              institution: '',
              board: '',
              year: '',
              grade: '',
              percentage: ''
            }
          ]
        });
        setIsEditing(true); // Automatically enable editing for new users
      } else {
        // Use existing data for returning users
        setUserData(data);
        setEmail(data.email || userEmail); // Set email with fallback to token
        setProfilePic(data.profile || null);
        setExperience(data.experience || [{
          company: '',
          position: '',
          duration: '',
          description: ''
        }]);
        setSkills(data.skillset || data.skills || [""]);
        setEducation(data.education || [
          {
            type: '12th',
            institution: '',
            board: '',
            year: '',
            grade: '',
            percentage: ''
          },
          {
            type: 'Graduation',
            institution: '',
            board: '',
            year: '',
            grade: '',
            percentage: ''
          }
        ]);
      }
      
      setProfileCompleted(data.profileCompleted || false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 404) {
        // Handle new user case
        const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
        setUserData({
          email: userEmail, // Use email from token
          department: 'Information Technology',
          course: 'B. Tech. Information Technology',
          experience: [{
            company: '',
            position: '',
            duration: '',
            description: ''
          }],
          skills: [''],
          education: [
            {
              type: '12th',
              institution: '',
              board: '',
              year: '',
              grade: '',
              percentage: ''
            },
            {
              type: 'Graduation',
              institution: '',
              board: '',
              year: '',
              grade: '',
              percentage: ''
            }
          ]
        });
        setEmail(userEmail); // Set email from token
        setProfileCompleted(false);
        setIsEditing(true); // Automatically enable editing for new users
      } else {
        let errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'An unexpected error occurred.';
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      updated[index] = value;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setter(updated);
  };

  // Validation helpers
  const isAlpha = str => /^[A-Za-z]+$/.test(str);
  const isPhone = str => /^\d{10}$/.test(str);
  const isPercentage = str => /^\d{1,2}(\.\d+)?$|^100(\.0+)?$/.test(str);
  const isMonth = n => Number.isInteger(+n) && +n >= 1 && +n <= 12;
  const isYear = y => /^\d{4}$/.test(String(y));
  const isNotFuture = date => new Date(date) <= new Date();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    // Name validation
    if (["first_name", "middle_name", "last_name"].includes(name)) {
      if (value && !/^[A-Za-z]*$/.test(value)) return;
    }
    // Phone validation
    if (["phone", "alt_phone"].includes(name)) {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert potential null values to empty strings for form inputs
  const safeValue = (value) => value === null || value === undefined ? '' : value;

  const handleAddField = (setter, list, template) => setter([...list, template]);

  const handleRemoveField = (setter, list, index) => {
    const updatedList = [...list];
    updatedList.splice(index, 1);
    setter(updatedList);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate the profile data
      const validationErrors = validateProfile(userData);
      if (validationErrors.length > 0) {
        setError(validationErrors.join('\n'));
        setIsSubmitting(false);
        return;
      }

      // Prepare the profile data with null checks
      const profileData = {
        ...userData,
        email,
        profile: profilePic || null,
        experience: Array.isArray(experience) ? experience.filter(exp => exp && exp.company && exp.position) : [],
        skillset: Array.isArray(skills) ? skills.filter(s => s && typeof s === 'string' && s.trim() !== '') : [],
        education: Array.isArray(education) ? education.filter(edu => edu && edu.institution && edu.board) : [],
        projects: Array.isArray(projects) ? projects.filter(p => p && (p.title || p.description)).map(proj => ({
          title: proj.title || '',
          description: proj.description || '',
          technologies: proj.technologies || '',
          duration: proj.duration || '',
          link: proj.link || ''
        })) : [],
        achievements: Array.isArray(achievements) ? achievements.filter(a => a && (a.title || a.description)).map(ach => ({
          type: ach.type || 'sports',
          title: ach.title || '',
          description: ach.description || '',
          date: ach.date || '',
          organization: ach.organization || ''
        })) : [],
        profileCompleted: true
      };

      console.log('Submitting alumni profile payload:', profileData);

      // Try to update the profile with retries
      let retryCount = 0;
      const maxRetries = 3;
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          const response = await axiosInstance.put('/api/alumni/profile', profileData);
          console.log('Profile update response:', response.data);
          
          // Update local storage with new profile data
          const updatedUser = {
            ...JSON.parse(localStorage.getItem('user') || '{}'),
            profileCompleted: true
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          setProfileCompleted(true);
          setIsEditing(false);
          toast.success('Profile updated successfully!');
          navigate('/home');
          success = true;
        } catch (error) {
          retryCount++;
          console.error(`Attempt ${retryCount} failed:`, error);
          
          if (retryCount === maxRetries) {
            throw error; // Throw error after all retries are exhausted
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Full error details:', error.response?.data);
      
      let errorMessage = 'Failed to update profile. ';
      if (error.message === 'Network Error') {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
      } else {
        errorMessage += 'Please try again later.';
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSkill = () => {
    if (!isEditing) return;
    setSkills([...skills, '']);
  };

  const handleRemoveSkill = (index) => {
    if (!isEditing) return;
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, value) => {
    if (!isEditing) return;
    setSkills(skills.map((skill, i) => (i === index ? value : skill)));
  };

  const handleAddProject = () => {
    if (!isEditing) return;
    setProjects([...projects, { title: '', description: '', technologies: '', duration: '', link: '' }]);
  };

  const handleRemoveProject = (index) => {
    if (!isEditing) return;
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index, field, value) => {
    if (!isEditing) return;
    setProjects(projects.map((project, i) =>
      i === index ? { ...project, [field]: value } : project
    ));
  };

  const handleAddAchievement = () => {
    if (!isEditing) return;
    setAchievements([...achievements, { type: 'sports', title: '', description: '', date: '', organization: '' }]);
  };

  const handleRemoveAchievement = (index) => {
    if (!isEditing) return;
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleAchievementChange = (index, field, value) => {
    if (!isEditing) return;
    setAchievements(achievements.map((achievement, i) =>
      i === index ? { ...achievement, [field]: value } : achievement
    ));
  };

  // Add this function to sync all form states with userData
  const syncFormStatesWithUserData = () => {
    if (userData) {
      setSkills(userData.skillset || userData.skills || [""]);
      setProjects(userData.projects || [{ title: '', description: '', technologies: '', duration: '', link: '' }]);
      setAchievements(userData.achievements || [{ type: 'sports', title: '', description: '', date: '', organization: '' }]);
      setExperience(userData.experience || [{ company: '', position: '', duration: '', description: '' }]);
      setEducation(userData.education || [
        {
          type: '12th',
          institution: '',
          board: '',
          year: '',
          grade: '',
          percentage: ''
        },
        {
          type: 'Graduation',
          institution: '',
          board: '',
          year: '',
          grade: '',
          percentage: ''
        }
      ]);
    }
  };

  function validateProfile(data) {
    const errors = [];
    // DOB
    const dob = new Date(data.dob);
    // Education
    const edu10 = data.education?.find(e => e.type === '10th');
    const edu12 = data.education?.find(e => e.type === '12th');
    const grad = data.education?.find(e => e.type === 'Graduation');
    if (edu10 && isYear(edu10.year)) {
      if (dob.getFullYear() + 15 > +edu10.year) errors.push('10th passing year must be at least 15 years after DOB');
    }
    if (edu12 && edu10 && isYear(edu12.year) && isYear(edu10.year)) {
      if (+edu10.year + 2 > +edu12.year) errors.push('12th passing year must be at least 2 years after 10th');
    }
    if (grad && edu12 && isYear(grad.year) && isYear(edu12.year)) {
      if (+edu12.year + 4 > +grad.year) errors.push('Graduation passing year must be at least 4 years after 12th');
    }
    // Achievements - only validate date if it's provided
    if (Array.isArray(data.achievements)) {
      for (const ach of data.achievements) {
        if (ach.date && ach.date.trim() !== '') {
          if (!isNotFuture(ach.date) || new Date(ach.date) < dob) {
            errors.push('Achievement date must not be in the future and after DOB');
          }
        }
      }
    }
    // Experience/Projects
    if (Array.isArray(data.experience)) {
      for (const exp of data.experience) {
        if (exp.months && !isMonth(exp.months)) errors.push('Experience months must be between 1 and 12');
      }
    }
    if (Array.isArray(data.projects)) {
      for (const proj of data.projects) {
        if (proj.months && !isMonth(proj.months)) errors.push('Project months must be between 1 and 12');
      }
    }
    // Percentage
    if (Array.isArray(data.education)) {
      for (const edu of data.education) {
        if (edu.percentage && (!isPercentage(edu.percentage) || +edu.percentage > 100 || +edu.percentage < 0)) {
          errors.push('Percentage must be between 0 and 100');
        }
      }
    }
    // Phone
    if (data.phone && !isPhone(data.phone)) errors.push('Phone must be 10 digits');
    if (data.alt_phone && !isPhone(data.alt_phone)) errors.push('Alternate phone must be 10 digits');
    return errors;
  }

  // Add function to handle adding education
  const handleAddEducation = () => {
    setEducation([...education, {
      type: 'Post Graduation',
      institution: '',
      board: '',
      year: '',
      grade: '',
      percentage: ''
    }]);
  };

  // Add function to handle removing education
  const handleRemoveEducation = (index) => {
    if (education[index].type === 'Post Graduation') {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="adash-container">
        <div className="container py-5">
          <div className="card shadow-lg p-4 rounded-4">
            <div className="text-center mb-4">
              <h2 className="text-primary fw-bold">
                <FaUser className="me-2" />
                Alumni Dashboard
              </h2>
              <p className="text-muted">Complete your profile to get started</p>
            </div>

            {!profileCompleted && (
              <div className="alert alert-info mb-4">
                <h5 className="alert-heading">Please complete your profile</h5>
                <p>Fill out all required fields (marked with *) to complete your profile. This information will be visible to other alumni and students.</p>
                <hr />
                <p className="mb-0">After completing your profile, click the "Save Profile" button at the bottom of the form to save your information.</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger mb-4">
                {error}
              </div>
            )}

            {!isEditing && (
              <div className="text-center mb-4">
                <button
                  type="button"
                  className="btn btn-warning btn-lg"
                  onClick={() => {
                    setIsEditing(true);
                    syncFormStatesWithUserData();
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )}

            <form onSubmit={onSubmit}>
              {/* Profile Photo Section */}
              <div className="mb-4 text-center">
                <div className="position-relative d-inline-block">
                  <div
                    className="rounded-circle overflow-hidden"
                    style={{
                      width: "150px",
                      height: "150px",
                      border: "3px solid #0d6efd",
                      margin: "auto",
                    }}
                  >
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                        <FaUser size={50} className="text-muted" />
                      </div>
                    )}
                  </div>
                  <label
                    className="btn btn-primary rounded-circle position-absolute bottom-0 end-0"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="d-none"
                    />
                    <FaUser className="m-0" />
                  </label>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Personal Information</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={safeValue(userData.first_name)}
                        onChange={handleFieldChange}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Middle Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="middle_name"
                        value={safeValue(userData.middle_name)}
                        onChange={handleFieldChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={safeValue(userData.last_name)}
                        onChange={handleFieldChange}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={safeValue(email) || safeValue(userData.email)}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date of Birth *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dob"
                        value={userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : ''}
                        onChange={handleFieldChange}
                        min={minDob}
                        max={maxDob}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Gender *</label>
                      <select
                        name="gender"
                        className="form-select"
                        value={safeValue(userData.gender)}
                        onChange={handleFieldChange}
                        required
                        disabled={!isEditing}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <FaGraduationCap className="me-2" />
                    Academic Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Department *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="department"
                        value="Information Technology"
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Course *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="course"
                        value="B. Tech. Information Technology"
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Passing Year *</label>
                      <input
                        type="month"
                        className="form-control"
                        name="passing_year"
                        value={safeValue(userData.passing_year)}
                        onChange={handleFieldChange}
                        min={minPassingYear}
                        max={maxPassingYear}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <FaBriefcase className="me-2" />
                    Professional Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Current Company *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="current_company"
                        value={safeValue(userData.current_company)}
                        onChange={handleFieldChange}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Designation *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="designation"
                        value={safeValue(userData.designation)}
                        onChange={handleFieldChange}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Current Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="current_location"
                        value={safeValue(userData.current_location)}
                        onChange={handleFieldChange}
                        placeholder="e.g., Mumbai, Maharashtra"
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Joined Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="joined_date"
                        value={userData.joined_date ? new Date(userData.joined_date).toISOString().split('T')[0] : ''}
                        onChange={handleFieldChange}
                        min={userData.passing_year ? new Date(userData.passing_year).toISOString().split('T')[0] : ''}
                        max={new Date().toISOString().split('T')[0]}
                        required
                        disabled={!isEditing}
                      />
                      {error && error.includes('Joining date') && (
                        <div className="text-danger mt-1">
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <FaIdCard className="me-2" />
                    Contact Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={userData.phone}
                        onChange={handleFieldChange}
                        maxLength={10}
                        pattern="\d{10}"
                        title="Phone must be 10 digits."
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Alternate Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="alt_phone"
                        value={userData.alt_phone}
                        onChange={handleFieldChange}
                        maxLength={10}
                        pattern="\d{10}"
                        title="Alternate Phone must be 10 digits."
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Current Address *</label>
                      <textarea
                        className="form-control"
                        name="current_address"
                        value={safeValue(userData.current_address)}
                        onChange={handleFieldChange}
                        rows="3"
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Permanent Address *</label>
                      <textarea
                        className="form-control"
                        name="permanent_address"
                        value={safeValue(userData.permanent_address)}
                        onChange={handleFieldChange}
                        rows="3"
                        required
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <FaBriefcase className="me-2" />
                    Work Experience
                  </h5>
                </div>
                <div className="card-body">
                  {experience.map((exp, index) => (
                    <div key={index} className="mb-4 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Experience {index + 1}</h6>
                        {index > 0 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveField(setExperience, experience, index)}
                            disabled={!isEditing}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Company</label>
                          <input
                            type="text"
                            className="form-control"
                            value={safeValue(exp.company)}
                            onChange={(e) => handleChange(setExperience, experience, index, 'company', e.target.value)}
                            placeholder="Company name"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Position</label>
                          <input
                            type="text"
                            className="form-control"
                            value={safeValue(exp.position)}
                            onChange={(e) => handleChange(setExperience, experience, index, 'position', e.target.value)}
                            placeholder="Job position"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Duration</label>
                          <input
                            type="number"
                            className="form-control"
                            name="years"
                            value={exp.years || ''}
                            onChange={e => handleChange(setExperience, experience, index, 'years', e.target.value.replace(/[^\d]/g, ''))}
                            min={0}
                            max={50}
                            placeholder="Years"
                            disabled={!isEditing}
                          />
                          <span>Year(s)</span>
                          <input
                            type="number"
                            className="form-control"
                            name="months"
                            value={exp.months || ''}
                            onChange={e => handleChange(setExperience, experience, index, 'months', e.target.value.replace(/[^\d]/g, ''))}
                            min={0}
                            max={11}
                            placeholder="Months"
                            disabled={!isEditing}
                          />
                          <span>Month(s)</span>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Description</label>
                          <input
                            type="text"
                            className="form-control"
                            value={safeValue(exp.description)}
                            onChange={(e) => handleChange(setExperience, experience, index, 'description', e.target.value)}
                            placeholder="Job description"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleAddField(setExperience, experience, {
                        company: '',
                        position: '',
                        duration: '',
                        description: ''
                      })}
                    >
                      <FaPlus className="me-2" />
                      Add Experience
                    </button>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <FaCode className="me-2" />
                    Skill Set
                  </h5>
                </div>
                <div className="card-body">
                  {skills.map((skill, index) => (
                    <div key={index} className="mb-3">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={safeValue(skill)}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          placeholder="Enter a skill"
                          disabled={!isEditing}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRemoveSkill(index)}
                          disabled={!isEditing}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleAddSkill()}
                    >
                      <FaPlus className="me-2" />
                      Add Skill
                    </button>
                  )}
                </div>
              </div>

              {/* Education Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Education Details</h5>
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      onClick={handleAddEducation}
                    >
                      <FaPlus /> Add Education
                    </button>
                  )}
                </div>
                <div className="card-body">
                  {education.map((edu, index) => (
                    <div key={index} className="mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Education {index + 1}</h6>
                        {isEditing && edu.type === 'Post Graduation' && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveEducation(index)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Type</label>
                          <input
                            type="text"
                            className="form-control"
                            value={edu.type}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Institution</label>
                          <input
                            type="text"
                            className="form-control"
                            value={edu.institution}
                            onChange={(e) => handleChange(setEducation, education, index, 'institution', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Board</label>
                          <input
                            type="text"
                            className="form-control"
                            value={edu.board}
                            onChange={(e) => handleChange(setEducation, education, index, 'board', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Year</label>
                          <input
                            type="number"
                            className="form-control"
                            value={edu.year}
                            onChange={(e) => handleChange(setEducation, education, index, 'year', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Grade</label>
                          <input
                            type="text"
                            className="form-control"
                            value={edu.grade}
                            onChange={(e) => handleChange(setEducation, education, index, 'grade', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Percentage</label>
                          <input
                            type="number"
                            className="form-control"
                            value={edu.percentage}
                            onChange={(e) => handleChange(setEducation, education, index, 'percentage', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <FaProjectDiagram className="me-2" />
                    Projects
                  </h5>
                </div>
                <div className="card-body">
                  {projects.map((project, index) => (
                    <div key={index} className="mb-4 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Project {index + 1}</h6>
                        {index > 0 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveProject(index)}
                            disabled={!isEditing}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                            placeholder="Project Title"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Technologies</label>
                          <input
                            type="text"
                            className="form-control"
                            value={project.technologies}
                            onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                            placeholder="Technologies Used"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                            placeholder="Project Description"
                            rows="3"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Duration</label>
                          <input
                            type="text"
                            className="form-control"
                            value={project.duration}
                            onChange={(e) => handleProjectChange(index, 'duration', e.target.value)}
                            placeholder="Duration"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Project Link</label>
                          <input
                            type="text"
                            className="form-control"
                            value={project.link}
                            onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                            placeholder="Project Link"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleAddProject()}
                    >
                      <FaPlus className="me-2" />
                      Add Project
                    </button>
                  )}
                </div>
              </div>

              {/* Achievements Section */}
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">
                    <FaTrophy className="me-2" />
                    Achievements
                  </h5>
                </div>
                <div className="card-body">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="mb-4 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Achievement {index + 1}</h6>
                        {index > 0 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveAchievement(index)}
                            disabled={!isEditing}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Type</label>
                          <select
                            className="form-select"
                            value={achievement.type}
                            onChange={(e) => handleAchievementChange(index, 'type', e.target.value)}
                            disabled={!isEditing}
                          >
                            <option value="">Select Type</option>
                            <option value="sports">Sports</option>
                            <option value="awards">Awards</option>
                            <option value="academic">Academic</option>
                            <option value="events">Events</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={achievement.title}
                            onChange={(e) => handleAchievementChange(index, 'title', e.target.value)}
                            placeholder="Achievement Title"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            value={achievement.description}
                            onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                            placeholder="Description"
                            rows="3"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={achievement.date}
                            onChange={(e) => handleAchievementChange(index, 'date', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Organization</label>
                          <input
                            type="text"
                            className="form-control"
                            value={achievement.organization}
                            onChange={(e) => handleAchievementChange(index, 'organization', e.target.value)}
                            placeholder="Organization"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleAddAchievement()}
                    >
                      <FaPlus className="me-2" />
                      Add Achievement
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg w-100" style={{ minWidth: 160, borderRadius: '2em', boxShadow: '0 4px 15px rgba(26,42,108,0.15)', fontWeight: 600, transition: 'all 0.2s' }}>
                    Save
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniDashboard;
