import React, { useEffect, useState } from 'react';
import { adminService, uploadService } from '../services/api';
import Header from './Header';
import { FaUser, FaSave, FaEdit, FaCamera } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', phone: '', profile: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminService.getProfile();
        setProfile(res);
        // Only set the fields we want to edit, exclude createdAt and updatedAt
        setForm({
          username: res.username || '',
          email: res.email || '',
          phone: res.phone || '',
          profile: res.profile || ''
        });
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Compress image before converting to base64
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Handle file upload and convert to base64
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          setError('Image size should be less than 2MB');
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          setError('Please select an image file');
          return;
        }

        // Upload file and get URLs
        const urls = await uploadService.uploadProfilePhoto(file);
        
        // Update form with GitHub URL
        setForm(prev => ({ ...prev, profile: urls.githubUrl }));
        setError('');
        toast.success('Profile photo uploaded successfully!');
      } catch (err) {
        console.error('Error uploading profile photo:', err);
        setError('Error uploading profile photo. Please try again.');
        toast.error('Error uploading profile photo. Please try again.');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      console.log('Starting profile update...');
      
      // Validate profile image if present
      if (form.profile) {
        // Check if it's a valid image URL (base64 or HTTP/HTTPS)
        const isValidBase64 = form.profile.startsWith('data:image/');
        const isValidUrl = form.profile.startsWith('http://') || form.profile.startsWith('https://');
        
        if (!isValidBase64 && !isValidUrl) {
          console.log('Invalid profile image format');
          setError('Invalid profile image format');
          return;
        }
      }

      // Create a clean update object without createdAt and updatedAt
      const updateData = {
        username: form.username,
        email: form.email
      };
      
      // Only include profile if it exists
      if (form.profile) {
        updateData.profile = form.profile;
      }

      console.log('Sending update request...');
      const res = await adminService.updateProfile(updateData);
      console.log('Profile update successful:', res);
      
      setProfile(res);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      
      // Update localStorage with new profile data
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        console.log('Updating localStorage with new profile data');
        const updatedUser = { ...user, ...res };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Error updating admin profile:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || 'Failed to update profile';
      console.error('Error details:', err.response?.data);
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div className="content">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="card shadow-lg p-4 rounded-4 mx-auto" style={{ maxWidth: 600 }}>
          <div className="text-center mb-4">
            <h2 className="text-primary fw-bold">
              <FaUser className="me-2" />
              Admin Profile
            </h2>
            <p className="text-muted">Manage your admin profile information</p>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          {/* Profile Photo Section */}
          <div className="mb-4 text-center">
            <div className="position-relative d-inline-block">
              <div
                className="rounded-circle overflow-hidden"
                style={{ width: "120px", height: "120px", border: "3px solid #0d6efd", margin: "auto" }}
              >
                {form.profile ? (
                  <img
                    src={form.profile}
                    alt="Profile"
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      console.error('Error loading profile image');
                      e.target.onerror = null; // Prevent infinite loop
                      setForm(prev => ({ ...prev, profile: '' }));
                      setError('Failed to load profile image. Please try uploading again.');
                    }}
                  />
                ) : (
                  <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                    <FaUser size={50} className="text-muted" />
                  </div>
                )}
              </div>
              {editMode && (
                <label
                  className="btn btn-primary rounded-circle position-absolute bottom-0 end-0"
                  style={{ width: "40px", height: "40px", cursor: "pointer" }}
                  title="Upload profile photo"
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleProfilePicChange}
                    className="d-none"
                  />
                  <FaCamera />
                </label>
              )}
            </div>
          </div>
          {!editMode ? (
            <div className="px-2">
              <div className="mb-3"><strong>Username:</strong> {profile?.username}</div>
              <div className="mb-3"><strong>Email:</strong> {profile?.email}</div>
              <button className="btn btn-primary mt-3 w-100" onClick={() => setEditMode(true)}>
                <FaEdit className="me-2" />Edit Profile
              </button>
            </div>
          ) : (
            <form className="px-2" onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" name="username" value={form.username} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required disabled />
              </div>
              <button className="btn btn-success me-2 w-100" type="submit">
                <FaSave className="me-2" />Save
              </button>
              <button className="btn btn-secondary w-100 mt-2" type="button" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminProfile; 