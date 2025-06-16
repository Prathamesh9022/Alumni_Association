import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaGraduationCap, FaBriefcase, FaSave, FaIdCard, FaTrash, FaPlus, FaTrophy, FaProjectDiagram, FaCode } from 'react-icons/fa';
import Header from './Header';
import axiosInstance from '../utils/axiosConfig';
import './Adash.css';
import { toast } from 'react-hot-toast';
import { alumniService, uploadService } from '../services/api';

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
      percentage: ''
    },
    {
      type: 'Graduation',
      institution: '',
      board: '',
      year: '',
      percentage: ''
    }
  ]);
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState({
    passing_year: '',
    current_address: '',
    permanent_address: '',
  });
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

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    department: 'Information Technology',
    course: 'B. Tech. Information Technology',
    passingYear: '',
    alumniId: '',
    phone: '',
    altPhone: '',
    currentAddress: '',
    permanentAddress: '',
    profilePic: null,
    current_company: '',
    designation: '',
    current_location: '',
    joined_date: ''
  });

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
      const userEmail = user?.email;
      
      const response = await axiosInstance.get('/api/alumni/profile');
      const data = response.data;
      
      if (!data.email && userEmail) {
        data.email = userEmail;
      }
      
      const isNewUser = !data.profileCompleted && (!data.experience || data.experience.length === 0);
      
      if (isNewUser) {
        setUserData({
          ...data,
          email: data.email || userEmail,
          department: 'Information Technology',
          course: 'B. Tech. Information Technology',
          current_company: '',
          designation: '',
          current_location: '',
          joined_date: '',
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
              percentage: ''
            },
            {
              type: 'Graduation',
              institution: '',
              board: '',
              year: '',
              percentage: ''
            }
          ]
        });
        setIsEditing(true);
      } else {
        setUserData(data);
        setEmail(data.email || userEmail);
        setProfilePic(data.profile || null);
        setFormData(prev => ({
          ...prev,
          current_company: data.current_company || '',
          designation: data.designation || '',
          current_location: data.current_location || '',
          joined_date: data.joined_date || ''
        }));
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
            percentage: ''
          },
          {
            type: 'Graduation',
            institution: '',
            board: '',
            year: '',
            percentage: ''
          }
        ]);
      }
      
      setProfileCompleted(data.profileCompleted || false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 404) {
        const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
        setUserData({
          email: userEmail,
          department: 'Information Technology',
          course: 'B. Tech. Information Technology',
          current_company: '',
          designation: '',
          current_location: '',
          joined_date: '',
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
              percentage: ''
            },
            {
              type: 'Graduation',
              institution: '',
              board: '',
              year: '',
              percentage: ''
            }
          ]
        });
        setEmail(userEmail);
        setProfileCompleted(false);
        setIsEditing(true);
      } else {
        setError(error.response?.data?.error || "Failed to fetch profile");
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

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast.error('Image size should be less than 2MB');
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file');
          return;
        }

        // Upload file and get URLs
        const urls = await uploadService.uploadProfilePhoto(file);
        
        // Update form with GitHub URL
        setUserData(prev => ({ ...prev, profile: urls.githubUrl }));
        setProfilePic(urls.githubUrl);
        toast.success('Profile photo uploaded successfully!');
      } catch (err) {
        console.error('Error uploading profile photo:', err);
        toast.error('Error uploading profile photo. Please try again.');
      }
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Invalid authentication token. Please try logging in again.');
        return;
      }

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('User not found. Please log in again.');
        return;
      }

      // Validation
      if (!formData.firstName || !formData.lastName || !formData.dob || !formData.phone || !formData.currentAddress) {
        toast.error('Please fill all required fields.');
        return;
      }

      const payload = {
        email: user.email,
        department: formData.department,
        course: formData.course,
        first_name: formData.firstName,
        middle_name: formData.middleName || '',
        last_name: formData.lastName,
        dob: formData.dob,
        gender: formData.gender,
        passing_year: formData.passingYear,
        phone: formData.phone,
        alt_phone: formData.altPhone || '',
        alumni_id: formData.alumniId || '',
        current_address: formData.currentAddress,
        permanent_address: formData.permanentAddress,
        profile: profilePic || null,
        current_company: formData.current_company || '',
        designation: formData.designation || '',
        current_location: formData.current_location || '',
        joined_date: formData.joined_date || '',
        experience: experience.filter(exp => exp.company && exp.position && exp.duration),
        skillset: skills.filter(s => typeof s === 'string' && s.trim() !== ''),
        education: education.filter(edu => edu.institution && edu.board && edu.year && edu.percentage),
        projects: projects.filter(p => p.title || p.description).map(proj => ({
          title: proj.title,
          description: proj.description,
          technologies: proj.technologies || '',
          duration: proj.duration || '',
          link: proj.link || ''
        })),
        achievements: achievements.filter(a => a.title || a.description).map(ach => ({
          type: ach.type || 'sports',
          title: ach.title,
          description: ach.description,
          date: ach.date || '',
          organization: ach.organization || ''
        })),
        profileCompleted: true
      };

      console.log('Submitting alumni profile payload:', payload);
      
      // Use alumniService to update the profile
      const response = await alumniService.updateProfile(payload);

      if (response.data) {
        toast.success('Profile updated successfully!');
        setProfileCompleted(true);
        setIsEditing(false);
        // Update local storage with new profile data
        const updatedUser = { ...user, profileCompleted: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Redirect to home page after successful update
        navigate('/home');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
      console.error('Full error details:', error.response?.data);
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
          percentage: ''
        },
        {
          type: 'Graduation',
          institution: '',
          board: '',
          year: '',
          percentage: ''
        }
      ]);
    }
  };

  function validateProfile(data) {
    // DOB
    const dob = new Date(data.dob);
    // Education
    const edu10 = data.education?.find(e => e.type === '10th');
    const edu12 = data.education?.find(e => e.type === '12th');
    const grad = data.education?.find(e => e.type === 'Graduation');
    if (edu10 && isYear(edu10.year)) {
      if (dob.getFullYear() + 15 > +edu10.year) return '10th passing year must be at least 15 years after DOB';
    }
    if (edu12 && edu10 && isYear(edu12.year) && isYear(edu10.year)) {
      if (+edu10.year + 2 > +edu12.year) return '12th passing year must be at least 2 years after 10th';
    }
    if (grad && edu12 && isYear(grad.year) && isYear(edu12.year)) {
      if (+edu12.year + 4 > +grad.year) return 'Graduation passing year must be at least 4 years after 12th';
    }
    // Achievements - only validate date if it's provided
    if (Array.isArray(data.achievements)) {
      for (const ach of data.achievements) {
        if (ach.date && ach.date.trim() !== '') {
          if (!isNotFuture(ach.date) || new Date(ach.date) < dob) {
            return 'Achievement date must not be in the future and after DOB';
          }
        }
      }
    }
    // Experience/Projects
    if (Array.isArray(data.experience)) {
      for (const exp of data.experience) {
        if (exp.months && !isMonth(exp.months)) return 'Experience months must be between 1 and 12';
      }
    }
    if (Array.isArray(data.projects)) {
      for (const proj of data.projects) {
        if (proj.months && !isMonth(proj.months)) return 'Project months must be between 1 and 12';
      }
    }
    // Percentage
    if (Array.isArray(data.education)) {
      for (const edu of data.education) {
        if (edu.percentage && (!isPercentage(edu.percentage) || +edu.percentage > 100 || +edu.percentage < 0)) return 'Percentage must be between 0 and 100';
      }
    }
    // Phone
    if (data.phone && !isPhone(data.phone)) return 'Phone must be 10 digits';
    if (data.alt_phone && !isPhone(data.alt_phone)) return 'Alternate phone must be 10 digits';
    return null;
  }

  // Add function to handle adding education
  const handleAddEducation = () => {
    setEducation([...education, {
      type: 'Post Graduation',
      institution: '',
      board: '',
      year: '',
      percentage: ''
    }]);
  };

  // Add function to handle removing education
  const handleRemoveEducation = (index) => {
    if (education[index].type === 'Post Graduation') {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  // Add function to handle copying current address
  const handleCopyCurrentAddress = (e) => {
    if (e.target.checked) {
      setUserData(prev => ({
        ...prev,
        permanent_address: prev.current_address
      }));
    }
  };

  // Add validation for education year and percentage
  const validateEducation = (edu) => {
    const birthYear = userData.dob ? new Date(userData.dob).getFullYear() : 0;
    const minYear = birthYear + 16;
    
    if (edu.year < minYear) {
      return `Year must be at least ${minYear} (16 years after birth)`;
    }
    
    if (edu.percentage < 0 || edu.percentage > 100) {
      return 'Percentage must be between 0 and 100';
    }
    
    return null;
  };

  // Add validation for project duration
  const validateProjectDuration = (duration) => {
    const months = parseInt(duration);
    if (isNaN(months) || months < 1 || months > 12) {
      return 'Project duration must be between 1 and 12 months';
    }
    return null;
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
                        value={safeValue(formData.firstName)}
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
                        value={safeValue(formData.middleName)}
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
                        value={safeValue(formData.lastName)}
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
                        value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
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
                        value={safeValue(formData.gender)}
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
                        value={safeValue(formData.department)}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Course *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="course"
                        value={safeValue(formData.course)}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Passing Year *</label>
                      <input
                        type="number"
                        name="passing_year"
                        value={safeValue(formData.passingYear)}
                        onChange={handleFieldChange}
                        className="form-control"
                        min={2003}
                        max={new Date().getFullYear()}
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
                        value={safeValue(formData.current_company)}
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
                        value={safeValue(formData.designation)}
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
                        value={safeValue(formData.current_location)}
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
                        value={formData.joined_date ? new Date(formData.joined_date).toISOString().split('T')[0] : ''}
                        onChange={handleFieldChange}
                        min={formData.passing_year ? new Date(formData.passing_year).toISOString().split('T')[0] : ''}
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
                        value={formData.phone}
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
                        value={formData.altPhone}
                        onChange={handleFieldChange}
                        maxLength={10}
                        pattern="\d{10}"
                        title="Alternate Phone must be 10 digits."
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-12">
                      <label>Current Address</label>
                      <textarea
                        name="current_address"
                        value={safeValue(formData.currentAddress)}
                        onChange={handleFieldChange}
                        className="form-control"
                        rows="3"
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="copyAddress"
                          onChange={handleCopyCurrentAddress}
                        />
                        <label className="form-check-label" htmlFor="copyAddress">
                          Same as Current Address
                        </label>
                      </div>
                      <label>Permanent Address</label>
                      <textarea
                        name="permanent_address"
                        value={safeValue(formData.permanentAddress)}
                        onChange={handleFieldChange}
                        className="form-control"
                        rows="3"
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
                    <div key={index} className="education-item mb-4">
                      <div className="row">
                        <div className="col-md-6">
                          <label>Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleChange(setEducation, education, index, 'institution', e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Board</label>
                          <input
                            type="text"
                            value={edu.board}
                            onChange={(e) => handleChange(setEducation, education, index, 'board', e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Year</label>
                          <input
                            type="number"
                            value={edu.year}
                            onChange={(e) => handleChange(setEducation, education, index, 'year', e.target.value)}
                            className="form-control"
                            min={userData.dob ? new Date(userData.dob).getFullYear() + 16 : 2000}
                            max={new Date().getFullYear()}
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Percentage</label>
                          <input
                            type="number"
                            value={edu.percentage}
                            onChange={(e) => handleChange(setEducation, education, index, 'percentage', e.target.value)}
                            className="form-control"
                            min="0"
                            max="100"
                            step="0.01"
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
                    <div key={index} className="project-item mb-4">
                      <div className="row">
                        <div className="col-md-6">
                          <label>Title</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Duration (months)</label>
                          <input
                            type="number"
                            value={project.duration}
                            onChange={(e) => handleProjectChange(index, 'duration', e.target.value)}
                            className="form-control"
                            min="1"
                            max="12"
                          />
                        </div>
                        <div className="col-md-12">
                          <label>Description</label>
                          <textarea
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                            className="form-control"
                            rows="3"
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Technologies</label>
                          <input
                            type="text"
                            value={project.technologies}
                            onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label>Project Link</label>
                          <input
                            type="url"
                            value={project.link}
                            onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                            className="form-control"
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

