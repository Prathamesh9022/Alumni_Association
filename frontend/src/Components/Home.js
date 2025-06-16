import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaGraduationCap, FaLightbulb, FaUsers, FaChevronRight, FaArrowRight, FaBullseye, FaFlag } from "react-icons/fa";
import "./Article.css";
import "../App.css";
import Header from "./Header";
import './Header.css';
import img1 from "../img/mgm1.jpg";
import img2 from "../img/mgm2.jpg";
import img3 from "../img/mgm3.jpg";
import timg from "../img/timg.jpg";
import pimg from "../img/photo.jpg";
import success1 from "../img/success1.png";
import success2 from "../img/success2.jpg";
import success3 from "../img/success3.jpg";
import success4 from "../img/success4.jpg";
import success5 from "../img/success5.jpg";
import success6 from "../img/success6.jpg";
import axiosInstance from "../utils/axiosConfig";
import './Home.css';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

// Add new CSS for the success stories and vision section
const styles = {
  successVisionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: '2rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    minHeight: '600px',
    position: 'relative',
    overflow: 'hidden',
  },
  successStoriesSlider: {
    flex: 1,
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '600px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  successStoryCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '5px',
      background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
    },
  },
  visionMissionSection: {
    flex: 1.5,
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '2rem',
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100px',
      height: '4px',
      background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
      borderRadius: '2px',
    },
  },
  subsectionTitle: {
    fontSize: '1.8rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    position: 'relative',
    paddingLeft: '1rem',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '70%',
      background: 'linear-gradient(180deg, #4e54c8, #8f94fb)',
      borderRadius: '2px',
    },
  },
  content: {
    fontSize: '1.1rem',
    color: '#34495e',
    lineHeight: '1.8',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: 'rgba(78,84,200,0.05)',
    borderRadius: '10px',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateX(5px)',
    },
  },
  successStoryImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #4e54c8',
    boxShadow: '0 5px 15px rgba(78,84,200,0.3)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  successStoryContent: {
    textAlign: 'center',
    position: 'relative',
    padding: '1rem',
  },
  quoteIcon: {
    position: 'absolute',
    color: '#4e54c8',
    opacity: 0.1,
    fontSize: '4rem',
  },
  quoteLeft: {
    top: '-20px',
    left: '-20px',
  },
  quoteRight: {
    bottom: '-20px',
    right: '-20px',
  },
};

export default function Home() {
  // Add user role state
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State for events with animation
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Mock success stories data
  const successStories = [
    {
      id: 1,
      image: success1,
      name: "Dr. Munir Sayyad",
      year: "Batch of 2000",
      company: "Asst. Vice President, Reliance Jio",
      story: "From humble beginnings at MGM, Dr. Sayyad rose to become a leader in telecom, pioneering 4G rollout across India. His journey is a testament to perseverance and vision."
    },
    {
      id: 2,
      image: success2,
      name: "Gaurav Shrivastava",
      year: "Batch of 2000",
      company: "CEO/CTO, Xlligent Softwares Pvt. Ltd. Bengaluru",
      story: "Gaurav founded his own tech company after years at global MNCs. He credits MGM for instilling the entrepreneurial spirit and technical foundation that drives his success."
    },
    {
      id: 3,
      image: success3,
      name: "Nikhil Dachawar",
      year: "Batch of 2010",
      company: "Senior Engineer, ARM Embedded Technologies",
      story: "Nikhil's passion for embedded systems was sparked at MGM. Today, he designs next-gen processors powering billions of devices worldwide."
    },
    {
      id: 4,
      image: success4,
      name: "Prashantsingh Bhadoria",
      year: "Batch of 2000",
      company: "Avionics Designer & PMP Certified Project Manager, Bengaluru",
      story: "Prashantsingh leads complex aerospace projects, blending technical expertise with project management skills honed at MGM."
    },
    {
      id: 5,
      image: success5,
      name: "Sonal Sarda",
      year: "Batch of 1994",
      company: "Freelance Corporate Trainer & Consultant, Bengaluru",
      story: "Sonal empowers professionals across India, drawing on her MGM education to deliver impactful training in leadership and communication."
    },
    {
      id: 6,
      image: success6,
      name: "Tanuja Patki",
      year: "Batch of 1990",
      company: "Scientist/Engineer, ISRO",
      story: "Tanuja played a key role in India's Mars mission. Her story inspires young women in STEM to reach for the stars, just as she did at MGM."
    }
  ];

  // Stats for the counter section
  const stats = [
    { label: "Alumni", value: 5000, icon: <FaGraduationCap /> },
    { label: "Events", value: 120, icon: <FaCalendarAlt /> },
    { label: "Placements", value: 450, icon: <FaLightbulb /> },
    { label: "Companies", value: 85, icon: <FaUsers /> }
  ];

  // Check user role on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) {
      setUserRole(user.role);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axiosInstance.get('/api/event');
          
          // Get upcoming events only
          const upcomingEvents = response.data
            .slice(0, 5) // Limit to 5 events for the news ticker
            .map(event => ({
              id: event._id,
              title: event.title,
              date: new Date(event.date).toLocaleDateString(),
              type: event.type
            }));
          
          setEvents(upcomingEvents);
        } else {
          // If not logged in, show sample events
          setEvents([
            { id: 1, title: "Annual Alumni Meet 2023", date: "Dec 15, 2023", type: "reunion" },
            { id: 2, title: "Tech Talk: AI and Future", date: "Dec 20, 2023", type: "webinar" },
            { id: 3, title: "Career Guidance Session", date: "Jan 5, 2024", type: "knowledge_sharing" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        // Set default events if API fails
        setEvents([
          { id: 1, title: "Annual Alumni Meet 2023", date: "Dec 15, 2023", type: "reunion" },
          { id: 2, title: "Tech Talk: AI and Future", date: "Dec 20, 2023", type: "webinar" },
          { id: 3, title: "Career Guidance Session", date: "Jan 5, 2024", type: "knowledge_sharing" }
        ]);
      }
    };

    fetchEvents();
    
    // Set up interval for event news ticker
    const eventInterval = setInterval(() => {
      setCurrentEventIndex(prevIndex => {
        const newIndex = events.length > 0 ? (prevIndex + 1) % events.length : 0;
        setAnimationKey(prev => prev + 1);
        return newIndex;
      });
    }, 5000);
    
    return () => clearInterval(eventInterval);
  }, [events.length]);

  // Carousel state for success stories
  const [leftIndex, setLeftIndex] = useState(0); // 0 to 5
  const [rightIndex, setRightIndex] = useState(successStories.length - 1); // 5 to 0

  // Set up interval for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % successStories.length);
      setRightIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Function to render a single success story card
  const renderSuccessStoryCard = (story) => (
    <motion.div
      className="success-story-card"
      style={styles.successStoryCard}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <img src={story.image} alt={story.name} style={styles.successStoryImage} />
      <div style={styles.successStoryContent}>
        <FaQuoteLeft style={{ ...styles.quoteIcon, ...styles.quoteLeft }} />
        <FaQuoteRight style={{ ...styles.quoteIcon, ...styles.quoteRight }} />
        <h4 style={{ fontWeight: 700, color: '#4e54c8', marginBottom: 8, fontSize: '1.4rem' }}>
          {story.name}
        </h4>
        <p style={{ fontWeight: 500, color: '#888', marginBottom: 4, fontSize: '1.1rem' }}>
          {story.year}
        </p>
        <p style={{ fontWeight: 600, color: '#222', marginBottom: 12, fontSize: '1.2rem' }}>
          {story.company}
        </p>
        <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.6 }}>
          {story.story}
        </p>
      </div>
    </motion.div>
  );

  // Function to render Vision & Mission section with summarized content
  const renderVisionMission = () => (
    <motion.div
      className="vision-mission-section"
      style={styles.visionMissionSection}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={styles.sectionTitle}>Vision & Mission</h2>
      
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 style={styles.subsectionTitle}>Institution Vision</h3>
        <p style={styles.content}>
          To be a leading Engineering institution developing proficient Engineers with global acceptance in the service of mankind.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 style={styles.subsectionTitle}>Institution Mission</h3>
        <p style={styles.content}>
          • Quality Engineering education with multidisciplinary approach<br />
          • Develop globally competent Engineers solving real-life problems<br />
          • Foster innovation, research, and industry collaboration<br />
          • Nurture leadership and ethical values
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 style={styles.subsectionTitle}>Department Vision</h3>
        <p style={styles.content}>
          To be a leading Department developing proficient IT Engineers with global acceptance in the service of society and IT industry.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 style={styles.subsectionTitle}>Department Mission</h3>
        <p style={styles.content}>
          • Develop IT Professionals with strong technical knowledge<br />
          • Create problem solvers using modern technologies<br />
          • Foster innovation and industry collaboration<br />
          • Promote ethics and lifelong learning
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 style={styles.subsectionTitle}>Program Objectives</h3>
        <p style={styles.content}>
          • Technical expertise in Hardware and Software Systems<br />
          • Analytical and design skills for sustainable solutions<br />
          • Research in emerging IT areas<br />
          • Leadership and entrepreneurial skills
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 style={styles.subsectionTitle}>Program Outcomes</h3>
        <p style={styles.content}>
          • Apply Software Engineering practices<br />
          • Develop applications in emerging technologies
        </p>
      </motion.div>
    </motion.div>
  );

  // Render role-specific call-to-action buttons
  const renderCtaButtons = () => {
    if (!isLoggedIn) {
      return (
        <Link to="/auth" className="btn btn-primary btn-lg" style={{ minWidth: 160, borderRadius: '2em', boxShadow: '0 4px 15px rgba(26,42,108,0.15)', fontWeight: 600, transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>Join Now <FaArrowRight /></Link>
      );
    }

    if (userRole === 'student') {
      return (
        <>
          <Link to="/mentorship" className="btn btn-primary btn-lg" style={{ minWidth: 160, borderRadius: '2em', boxShadow: '0 4px 15px rgba(26,42,108,0.15)', fontWeight: 600, transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>Find a Mentor <FaArrowRight /></Link>
          <Link to="/jobs" className="btn btn-secondary btn-lg" style={{ minWidth: 160, borderRadius: '2em', boxShadow: '0 4px 15px rgba(26,42,108,0.10)', fontWeight: 600, transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>Browse Jobs <FaArrowRight /></Link>
        </>
      );
    }

    if (userRole === 'alumni') {
      return (
        <>
          <Link to="/mentorship1" className="btn btn-primary btn-lg" style={{ minWidth: 160, borderRadius: '2em', boxShadow: '0 4px 15px rgba(26,42,108,0.15)', fontWeight: 600, transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>Become a Mentor <FaArrowRight /></Link>
          <Link to="/post-job" className="btn btn-secondary btn-lg" style={{ minWidth: 160, borderRadius: '2em', boxShadow: '0 4px 15px rgba(26,42,108,0.10)', fontWeight: 600, transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>Post a Job <FaArrowRight /></Link>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <Header />
      <div className="home-container">
      
        {/* Hero Banner with CAROUSEL */}
        <section className="hero-section">
          <div
            id="heroCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={img1} className="d-block w-100 carousel-img" alt="MGM Campus" />
                <div className="carousel-caption">
                  <h1 className="hero-title">
                    {userRole === 'student' 
                      ? 'Welcome to MGM Student Portal'
                      : 'Welcome to MGM Alumni Association'}
                  </h1>
                  <p className="hero-subtitle">
                    {userRole === 'student'
                      ? 'Connect with alumni mentors and explore opportunities'
                      : 'Connect with fellow alumni and grow your network'}
                  </p>
                  {renderCtaButtons()}
                </div>
              </div>
              <div className="carousel-item">
                <img src={img2} className="d-block w-100 carousel-img" alt="MGM Campus" />
                <div className="carousel-caption">
                  <h1 className="hero-title">Discover Opportunities</h1>
                  <p className="hero-subtitle">
                    {userRole === 'student'
                      ? 'Find internships, jobs, and mentorship programs'
                      : 'Find job postings, mentorship programs and more'}
                  </p>
                  <Link to="/jobs" className="hero-button">Explore Jobs <FaArrowRight /></Link>
                </div>
              </div>
              <div className="carousel-item">
                <img src={img3} className="d-block w-100 carousel-img" alt="MGM Campus" />
                <div className="carousel-caption">
                  <h1 className="hero-title">
                    {userRole === 'student'
                      ? 'Join Alumni Events'
                      : 'Attend Alumni Events'}
                  </h1>
                  <p className="hero-subtitle">
                    {userRole === 'student'
                      ? 'Learn from industry experts and build connections'
                      : 'Stay connected with reunions and knowledge sharing sessions'}
                  </p>
                  <Link to="/events" className="hero-button">View Events <FaArrowRight /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events News Ticker */}
        <section className="events-ticker-section">
          <div className="events-ticker">
            <div className="ticker-header">
              <FaCalendarAlt className="ticker-icon" />
              <h4>Upcoming Events</h4>
            </div>
            <div className="ticker-content">
              {events.length > 0 && (
                <div className="ticker-item" key={`event-${animationKey}`}>
                  <span className="event-title">{events[currentEventIndex].title}</span>
                  <span className="event-date">{events[currentEventIndex].date}</span>
                </div>
              )}
            </div>
            <Link to="/events" className="ticker-link">
              View All <FaChevronRight />
            </Link>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section className="stats-section">
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}+</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* About College Section */}
        <section className="about-section">
          <div className="section-header">
            <h2 className="section-title">About Our College</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="article-container">
            <div className="article-content">
              <div className="text-side">
                <h4>Our Legacy</h4>
                <h6>
                  <strong>
                    MGM Institutions have the privilege of the high caliber & long
                    standing experience of all our trustees in the field of
                    education and health services.
                  </strong>
                </h6>
                <p>
                  Mahatma Gandhi Mission (MGM) began with a rural health center in
                  Nila and a hospital in Nanded, now spanning 50+ institutions
                  across five cities. Over 35 years, MGM has championed value-based
                  education in Engineering, Medicine, Law, and more, with
                  cutting-edge infrastructure. The University of Health Sciences
                  furthers MGM's vision for quality and innovation in education. Its
                  founding members are accomplished Engineers, Doctors, and
                  Scientists, driven by social commitment. The Trust is led by Shri
                  Kamalkishor N. Kadam, Ex-Education Minister and MLC in
                  Maharashtra.
                </p>
              </div>
              <div className="image-side">
                <img src={timg} alt="Trustees" className="trustee-image" />
              </div>
            </div>
          </div>
        </section>

        {/* Reorganized Success Stories and Vision & Mission Section */}
        <section style={styles.successVisionContainer}>
          {/* Left Success Stories Carousel */}
          <div className="success-stories-carousel left" style={styles.successStoriesSlider}>
            {renderSuccessStoryCard(successStories[leftIndex])}
          </div>

          {/* Middle Vision & Mission Section */}
          <div className="vision-mission-section" style={styles.visionMissionSection}>
            {renderVisionMission()}
          </div>

          {/* Right Success Stories Carousel */}
          <div className="success-stories-carousel right" style={styles.successStoriesSlider}>
            {renderSuccessStoryCard(successStories[rightIndex])}
          </div>
        </section>


        
      </div>
    </>
  );
}
