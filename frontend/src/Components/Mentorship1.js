import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaComment, FaPaperPlane, FaTrash, FaFile, FaSmile, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaGraduationCap, FaCalendarAlt, FaBell, FaBellSlash } from 'react-icons/fa';
import axios from 'axios';
import Header from './Header';
import api from '../services/api';
import { mentorshipService } from '../services/api';
import './CommonStyles.css';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '👏'];

const Mentorship1 = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [mentoredStudents, setMentoredStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [showReactions, setShowReactions] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [success, setSuccess] = useState(null);
  const [showStudentList, setShowStudentList] = useState(false);
  const [maxStudents, setMaxStudents] = useState(3);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSkills, setFilterSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showMaxStudentsModal, setShowMaxStudentsModal] = useState(false);
  const [newMaxStudents, setNewMaxStudents] = useState(3);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [showYearModal, setShowYearModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showMaxStudentsError, setShowMaxStudentsError] = useState(false);
  const [maxStudentsError, setMaxStudentsError] = useState('');
  const [showSkillsError, setShowSkillsError] = useState(false);
  const [skillsError, setSkillsError] = useState('');
  const [showDepartmentError, setShowDepartmentError] = useState(false);
  const [departmentError, setDepartmentError] = useState('');
  const [showYearError, setShowYearError] = useState(false);
  const [yearError, setYearError] = useState('');
  const [showStatusError, setShowStatusError] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [showProfileError, setShowProfileError] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [showChatError, setShowChatError] = useState(false);
  const [chatError, setChatError] = useState('');
  const [showMessageError, setShowMessageError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [showFileError, setShowFileError] = useState(false);
  const [fileError, setFileError] = useState('');
  const [showReactionError, setShowReactionError] = useState(false);
  const [reactionError, setReactionError] = useState('');
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showEndMentorshipError, setShowEndMentorshipError] = useState(false);
  const [endMentorshipError, setEndMentorshipError] = useState('');
  const [showStartMentorshipError, setShowStartMentorshipError] = useState(false);
  const [startMentorshipError, setStartMentorshipError] = useState('');
  const [showAvailableStudentsError, setShowAvailableStudentsError] = useState(false);
  const [availableStudentsError, setAvailableStudentsError] = useState('');
  const [showMentoredStudentsError, setShowMentoredStudentsError] = useState(false);
  const [mentoredStudentsError, setMentoredStudentsError] = useState('');
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [showSkillsSuccess, setShowSkillsSuccess] = useState(false);
  const [skillsSuccess, setSkillsSuccess] = useState('');
  const [showDepartmentSuccess, setShowDepartmentSuccess] = useState(false);
  const [departmentSuccess, setDepartmentSuccess] = useState('');
  const [showYearSuccess, setShowYearSuccess] = useState(false);
  const [yearSuccess, setYearSuccess] = useState('');
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState('');
  const [showMaxStudentsSuccess, setShowMaxStudentsSuccess] = useState(false);
  const [maxStudentsSuccess, setMaxStudentsSuccess] = useState('');
  const [showChatSuccess, setShowChatSuccess] = useState(false);
  const [chatSuccess, setChatSuccess] = useState('');
  const [showMessageSuccess, setShowMessageSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState('');
  const [showFileSuccess, setShowFileSuccess] = useState(false);
  const [fileSuccess, setFileSuccess] = useState('');
  const [showReactionSuccess, setShowReactionSuccess] = useState(false);
  const [reactionSuccess, setReactionSuccess] = useState('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [showEndMentorshipSuccess, setShowEndMentorshipSuccess] = useState(false);
  const [endMentorshipSuccess, setEndMentorshipSuccess] = useState('');
  const [showStartMentorshipSuccess, setShowStartMentorshipSuccess] = useState(false);
  const [startMentorshipSuccess, setStartMentorshipSuccess] = useState('');
  const [showAvailableStudentsSuccess, setShowAvailableStudentsSuccess] = useState(false);
  const [availableStudentsSuccess, setAvailableStudentsSuccess] = useState('');
  const [showMentoredStudentsSuccess, setShowMentoredStudentsSuccess] = useState(false);
  const [mentoredStudentsSuccess, setMentoredStudentsSuccess] = useState('');

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !user || user.role !== 'alumni') {
          navigate('/auth');
          return;
        }

        setLoading(true);
        setError(null);

        // Fetch all required data in parallel
        const [studentsResponse, mentoredStudentsResponse, mentorsResponse] = await Promise.allSettled([
          fetchStudents(),
          fetchMentoredStudents(),
          fetchMentors()
        ]);

        // Handle responses
        if (studentsResponse.status === 'rejected') {
          console.error('Error fetching students:', studentsResponse.reason);
          setError('Failed to load students data. Please try again.');
        }

        if (mentoredStudentsResponse.status === 'rejected') {
          console.error('Error fetching mentored students:', mentoredStudentsResponse.reason);
          setError('Failed to load mentored students data. Please try again.');
        }

        if (mentorsResponse.status === 'rejected') {
          console.error('Error fetching mentors:', mentorsResponse.reason);
          setError('Failed to load mentors data. Please try again.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error in initial data fetch:', error);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  // Set up polling for new messages when a mentee is selected
  useEffect(() => {
    if (selectedMentee && notificationsEnabled) {
      const pollInterval = setInterval(async () => {
        await fetchMessages(selectedMentee._id);
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(pollInterval);
    }
  }, [selectedMentee, notificationsEnabled]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (studentId) => {
    if (!studentId) return;

    try {
      const response = await api.get(`/api/mentorship/messages?studentId=${studentId}`);
      if (response.data) {
        const sortedMessages = response.data.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sortedMessages);
        
        // Update unread messages count
        const unread = sortedMessages.filter(msg => 
          msg.senderRole === 'student' && !msg.read
        ).length;
        setUnreadMessages(unread);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again.');
    }
  };

  const handleSelectMentee = async (student) => {
    setSelectedMentee(student);
    setMessages([]); // Clear previous messages
    setShowChat(true);
    await fetchMessages(student._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      setIsSending(true);
      const formData = new FormData();
      if (newMessage.trim()) {
        formData.append('message', newMessage.trim());
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('studentId', selectedMentee._id);

      const response = await api.post('/api/mentorship/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessages(prev => [...prev, response.data.newMessage]);
      setNewMessage('');
      setSelectedFile(null);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleSelectStudent = async (studentId) => {
    try {
      if (mentoredStudents.some(student => student._id === studentId)) {
        setError('You are already mentoring this student');
        return;
      }

      if (selectedStudents.length >= maxStudents && !selectedStudents.includes(studentId)) {
        setError(`You can only mentor up to ${maxStudents} students`);
        return;
      }

      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      // If student is already selected but not yet mentored, remove them
      if (selectedStudents.includes(studentId)) {
        setSelectedStudents(selectedStudents.filter(id => id !== studentId));
      } else {
        // Add new student
        setSelectedStudents([...selectedStudents, studentId]);
      }

      // Clear any previous errors
      setError(null);
    } catch (error) {
      console.error('Error selecting student:', error);
      setError(error.response?.data?.message || 'Failed to select student. Please try again.');
    }
  };

  const handleStartMentorship = async () => {
    try {
      if (selectedStudents.length === 0) {
        setError('Please select at least one student');
        return;
      }

      console.log('Starting mentorship with students:', selectedStudents);
      
      const response = await api.post('/api/mentorship/start', {
        studentIds: selectedStudents
      });

      if (response.data) {
        setMentoredStudents(response.data);
        setSelectedStudents([]);
        setShowStudentList(false);
        setSuccess('Mentorship started successfully');
        // Refresh the list of available students
        fetchAvailableStudents();
      }
    } catch (error) {
      console.error('Detailed error starting mentorship:', error);
      setError(error.response?.data?.error || 'Failed to start mentorship');
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await api.post(`/api/mentorship/messages/${messageId}/reactions`, { emoji });
      await fetchMessages();
    } catch (error) {
      console.error('Error adding reaction:', error);
      setError('Failed to add reaction. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/api/mentorship/messages/${messageId}`);
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Failed to delete message. Please try again.');
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await api.get(`/api/mentorship/files/${fileId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file. Please try again.');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRequestMentorship = async (mentorId) => {
    try {
      await api.post('/mentorship/request', { mentorId });
      alert('Mentorship request sent successfully!');
    } catch (error) {
      console.error('Error requesting mentorship:', error);
      alert('Failed to send mentorship request. Please try again.');
    }
  };

  const renderMessage = (msg) => (
    <div
      key={msg._id}
      className={`mb-3 ${
        msg.senderRole === 'alumni' ? 'text-end' : ''
      }`}
    >
      <div
        className={`d-inline-block p-2 rounded-3 ${
          msg.senderRole === 'alumni'
            ? 'bg-primary text-white'
            : 'bg-light'
        }`}
      >
        <div className="d-flex justify-content-between align-items-start">
          <small className="d-block text-muted">
            {msg.senderName} ({msg.senderRole})
          </small>
          <div className="d-flex align-items-center">
            <button
              className="btn btn-sm btn-link text-white p-0 me-2"
              onClick={() => setShowReactions(showReactions === msg._id ? null : msg._id)}
            >
              <FaSmile />
            </button>
            {msg.senderRole === 'alumni' && (
              <button
                className="btn btn-sm btn-link text-white p-0"
                onClick={() => handleDeleteMessage(msg._id)}
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>
        </div>
        {msg.message && <p className="mb-0">{msg.message}</p>}
        {msg.file && (
          <div className="mt-2">
            <button
              className="btn btn-sm btn-light"
              onClick={() => handleDownloadFile(msg.file.id, msg.file.name)}
            >
              <FaFile className="me-1" />
              {msg.file.name}
            </button>
          </div>
        )}
        {msg.reactions && msg.reactions.length > 0 && (
          <div className="mt-1">
            {msg.reactions.map((reaction, index) => (
              <span key={index} className="me-1">
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
        {showReactions === msg._id && (
          <div className="reaction-picker mt-1">
            {REACTIONS.map((emoji, index) => (
              <button
                key={index}
                className="btn btn-sm btn-light me-1"
                onClick={() => {
                  handleReaction(msg._id, emoji);
                  setShowReactions(null);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <small className="d-block text-muted">
          {new Date(msg.timestamp).toLocaleString()}
        </small>
      </div>
    </div>
  );

  const fetchAvailableStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/mentorship/available-students');
      setAvailableStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching available students:', error);
      setError('Failed to fetch available students');
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user || user.role !== 'alumni') {
      throw new Error('Authentication required');
    }

    try {
      const response = await mentorshipService.getAvailableStudents();
      setStudents(response);
      return response;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  };

  const fetchMentoredStudents = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user || user.role !== 'alumni') {
      throw new Error('Authentication required');
    }

    try {
      const response = await mentorshipService.getMentees();
      setMentoredStudents(response);
      if (response.length > 0) {
        setSelectedStudents(response.map(student => student._id));
      }
      return response;
    } catch (error) {
      console.error('Error fetching mentored students:', error);
      if (error.response?.status === 404) {
        setMentoredStudents([]);
        setSelectedStudents([]);
      }
      throw error;
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await mentorshipService.getAvailableMentors();
      setMentors(response);
      setFilteredMentors(response);
      return response;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Mentor Dashboard</h2>
          <button 
            className="btn btn-outline-primary"
            onClick={toggleNotifications}
            title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
          >
            {notificationsEnabled ? <FaBell /> : <FaBellSlash />}
            {unreadMessages > 0 && (
              <span className="badge bg-danger ms-1">{unreadMessages}</span>
            )}
          </button>
        </div>
        <div className="row">
          {/* Available Students for Mentoring */}
          {mentoredStudents.length === 0 && (
          <div className="col-md-12">
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">
                  <FaUser className="me-2" />
                  Available Students for Mentoring
                </h4>
              </div>
              <div className="card-body">
                {students.length > 0 ? (
                  <div className="list-group">
                    {students.map(student => (
                      <div
                        key={student._id}
                        className={`list-group-item list-group-item-action ${
                          selectedStudents.includes(student._id) ? 'active' : ''
                        }`}
                        onClick={() => selectedStudents.length < maxStudents || selectedStudents.includes(student._id) ? handleSelectStudent(student._id) : null}
                        style={{ cursor: selectedStudents.length < maxStudents || selectedStudents.includes(student._id) ? 'pointer' : 'not-allowed', opacity: selectedStudents.length >= maxStudents && !selectedStudents.includes(student._id) ? 0.5 : 1 }}
                      >
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle overflow-hidden bg-light me-3" style={{ width: "40px", height: "40px" }}>
                            {student.profile ? (
                              <img
                                src={student.profile}
                                alt={student.first_name}
                                className="w-100 h-100 object-fit-cover"
                              />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                <FaUser className="text-muted" size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h6 className="mb-1">{`${student.first_name} ${student.last_name}`}</h6>
                            <small className="text-muted">
                              {student.department} - Year {student.current_year}
                            </small>
                            <div className="mt-1">
                              {(student.skillset || student.skills || []).map((skill, idx) => (
                                <span key={idx} className="badge bg-info me-1">{skill}</span>
                              ))}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="ms-auto"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => handleSelectStudent(student._id)}
                            onClick={e => e.stopPropagation()}
                            disabled={selectedStudents.length >= maxStudents && !selectedStudents.includes(student._id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No students available for mentorship</p>
                  </div>
                )}
                <button
                  className="btn btn-success mt-3 w-100"
                  onClick={handleStartMentorship}
                  disabled={selectedStudents.length === 0}
                >
                  Start Mentorship with Selected Students
                </button>
                <div className="mt-2 text-muted small">
                  Note: The current system does not support a mentorship request/acceptance workflow. Mentorship is started immediately when you select students and click the button.
                </div>
              </div>
            </div>
          </div>
          )}
          <div className="col-md-4">
            <div className="card shadow-lg mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <FaUser className="me-2" />
                  Your Mentees
                </h4>
              </div>
              <div className="card-body">
                {mentoredStudents.length > 0 ? (
                  <div className="list-group">
                    {mentoredStudents.map(student => {
                      const studentSkills = student.skillset || student.skills || [];
                      return (
                        <div
                          key={student._id}
                          className={`list-group-item list-group-item-action ${
                            selectedStudents.includes(student._id) ? 'active' : ''
                          }`}
                          onClick={() => {
                            handleSelectStudent(student._id);
                            setSelectedMentee(student);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle overflow-hidden bg-light me-3" style={{ width: "40px", height: "40px" }}>
                              {student.profile ? (
                                <img
                                  src={student.profile}
                                  alt={student.first_name}
                                  className="w-100 h-100 object-fit-cover"
                                />
                              ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                  <FaUser className="text-muted" size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <h6 className="mb-1">{`${student.first_name} ${student.last_name}`}</h6>
                              <small className="text-muted">
                                {student.department} - Year {student.current_year}
                              </small>
                              <div className="mt-1">
                                {studentSkills.map((skill, index) => (
                                  <span key={index} className="badge bg-info me-1">{skill}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No mentees assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <FaComment className="me-2" />
                  {selectedMentee ? `Chat with ${selectedMentee.first_name} ${selectedMentee.last_name}` : 'Chat with Mentees'}
                </h4>
              </div>
              <div className="card-body p-0">
                {/* Mentee details panel */}
                {selectedMentee ? (
                  <div className="p-3 border-bottom mb-2">
                    <div className="d-flex align-items-center mb-2">
                      <div className="rounded-circle overflow-hidden bg-light me-3" style={{ width: "60px", height: "60px" }}>
                        {selectedMentee.profile ? (
                          <img src={selectedMentee.profile} alt={selectedMentee.first_name} className="w-100 h-100 object-fit-cover" />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <FaUser className="text-muted" size={30} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="mb-1">{selectedMentee.first_name} {selectedMentee.last_name}</h5>
                        <div className="text-muted small">{selectedMentee.department} - Year {selectedMentee.current_year}</div>
                        <div className="text-muted small">{selectedMentee.email}</div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>Skills:</strong> {selectedMentee.skillset?.join(', ') || selectedMentee.skills?.join(', ') || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Student ID:</strong> {selectedMentee.student_id || 'N/A'}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border-bottom mb-2 text-center text-muted">
                    Select a mentee to view their details and start chatting.
                  </div>
                )}
                {/* Chat area only if mentee is selected */}
                {selectedMentee && (
                  <>
                    <div className="chat-messages p-3" style={{ height: '300px', overflowY: 'auto' }}>
                      {messages.length > 0 ? (
                        messages.map(renderMessage)
                      ) : (
                        <div className="text-center text-muted py-4">
                          No messages yet. Start the conversation!
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input border-top p-3">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage(e);
                            }
                          }}
                          disabled={isSending}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={(e) => handleSendMessage(e)}
                          disabled={isSending}
                        >
                          <FaPaperPlane />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mentorship1;
