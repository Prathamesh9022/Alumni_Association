import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home';
import Directory from './Components/Directory';
import Adash from './Components/Adash';
import Sdash from './Components/Sdash';
import AuthPage from './Components/AuthPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Logout from './Components/Logout';
import Mentorship from './Components/Mentorship';
import Mentorship1 from './Components/Mentorship1';
import PostJob from './Components/PostJob';
import Job from './Components/Job';
import AlumniProfile from './Components/AProfile';
import Event from './Components/Event';
import AddEvent from './Components/AddEvent';
import EventParticipants from './Components/EventParticipants';
import StudentProfile from './Components/StudentProfile';
import './Components/CommonStyles.css';
import './App.css';
import { Toaster } from 'react-hot-toast';
import ChatBot from './Components/ChatBot';
import Donation from './Components/Donation';
import Mentorship2 from './Components/Mentorship2';
import AddDonation from './Components/AddDonation';
import Directory1 from './Components/Directory1';
import AdminProfile from './Components/AdminProfile';
import Footer from './Components/Footer';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={["alumni", "student", "admin"]}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/adash" element={
            <ProtectedRoute roles={["alumni"]}>
              <Adash />
            </ProtectedRoute>
          } />
          <Route path="/sdash" element={
            <ProtectedRoute roles={["student"]}>
              <Sdash />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute roles={["alumni"]}>
              <AlumniProfile />
            </ProtectedRoute>
          } />
          <Route path="/student-profile" element={
            <ProtectedRoute roles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/student-profile/:id" element={
            <ProtectedRoute roles={["alumni", "student"]}>
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/mentorship" element={
            <ProtectedRoute roles={["student"]}>
              <Mentorship />
            </ProtectedRoute>
          } />
          <Route path="/mentorship1" element={
            <ProtectedRoute roles={["alumni"]}>
              <Mentorship1 />
            </ProtectedRoute>
          } />

          {/* Other Routes */}
          <Route path="/directory" element={
            <ProtectedRoute roles={["alumni", "student", "admin"]}>
              <Directory />
            </ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute roles={["alumni", "admin"]}>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute roles={["alumni", "student", "admin"]}>
              <Job />
            </ProtectedRoute>
          } />
          
          {/* Event Routes */}
          <Route path="/events" element={
            <ProtectedRoute roles={["alumni", "student", "admin"]}>
              <Event />
            </ProtectedRoute>
          } />
          <Route path="/add-event" element={
            <ProtectedRoute roles={["alumni", "admin"]}>
              <AddEvent />
            </ProtectedRoute>
          } />
          <Route path="/event/:eventId/participants" element={
            <ProtectedRoute roles={["alumni", "admin"]}>
              <EventParticipants />
            </ProtectedRoute>
          } />

          {/* Donation Route */}
          <Route path="/donation" element={
            <ProtectedRoute roles={["alumni", "admin"]}>
              <Donation />
            </ProtectedRoute>
          } />

          {/* Mentorship2 Route */}
          <Route path="/mentorship2" element={
            <ProtectedRoute roles={["admin"]}>
              <Mentorship2 />
            </ProtectedRoute>
          } />

          {/* Add Donation Route */}
          <Route path="/add-donation" element={
            <ProtectedRoute roles={["admin"]}>
              <AddDonation />
            </ProtectedRoute>
          } />

          {/* Directory1 Route */}
          <Route path="/directory1" element={
            <ProtectedRoute roles={["alumni", "student"]}>
              <Directory1 />
            </ProtectedRoute>
          } />

          {/* Admin Profile Route */}
          <Route path="/admin-profile" element={
            <ProtectedRoute roles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
      <ChatBot />
      <Footer />
    </>
  );
}

export default App;
