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

// Add new CSS for the success stories and vision section
const styles = {
  successVisionContainer: {
    display: 'flex',
    padding: '2rem',
    gap: '2rem',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    height: '100vh',
    overflow: 'hidden',
  },
  successStoriesSlider: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '100%',
    overflow: 'hidden',
  },
  successStoryCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  visionMissionSection: {
    flex: 1.5,
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    color: '#1a2a6c',
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  subsectionTitle: {
    color: '#1a2a6c',
    marginTop: '2rem',
    marginBottom: '1rem',
    fontSize: '1.4rem',
    fontWeight: 'bold',
  },
  content: {
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '1rem',
  },
  successStoryImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  successStoryName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1a2a6c',
    marginBottom: '0.5rem',
  },
  successStoryYear: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  successStoryCompany: {
    color: '#1a2a6c',
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  successStoryText: {
    color: '#666',
    fontSize: '0.9rem',
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
    <div className="success-story-card" key={story.id}>
      <img src={story.image} alt={story.name} className="success-story-image" />
      <div className="success-story-content">
        <div>
          <h3 style={styles.successStoryName}>{story.name}</h3>
          <p style={styles.successStoryYear}>{story.year}</p>
          <p style={styles.successStoryCompany}>{story.company}</p>
          <p style={styles.successStoryText}>{story.story}</p>
        </div>
      </div>
    </div>
  );

  // Function to render Vision & Mission section
  const renderVisionMission = () => (
    <div style={styles.visionMissionSection}>
      <h2 style={styles.sectionTitle}>Vision & Mission</h2>
      
      <div>
        <h3 style={styles.subsectionTitle}>Vision of the Institution</h3>
        <p style={styles.content}>
          To be one of the leading Institutions for Engineering education developing proficient
          Engineers with global acceptance in the service of mankind
        </p>
      </div>

      <div>
        <h3 style={styles.subsectionTitle}>Mission of the Institution</h3>
        <p style={styles.content}>
          • Providing quality Engineering education to cater the needs of Industry and society
          with a multidisciplinary approach on a sustainable basis.<br />
          • Developing globally competent Engineers having ability to solve real-life problems
          addressing environmental issues through technological advancements.<br />
          • Inculcating professionalism, teamwork, research, innovation and entrepreneurship,
          maintaining the spirit of continuous learning<br />
          • Fostering collaboration with industry, academia, research organizations, experts
          and alumni.<br />
          • Imparting employability skills, nurturing leadership qualities with ethical and social
          values among students.
        </p>
      </div>

      <div>
        <h3 style={styles.subsectionTitle}>Vision of the Department</h3>
        <p style={styles.content}>
          To be one of the leading Department to develop proficient IT Engineers with global
          acceptance in the service of society and the IT industry.
        </p>
      </div>

      <div>
        <h3 style={styles.subsectionTitle}>Mission of the Department</h3>
        <p style={styles.content}>
          • Developing successful IT Professionals with strong practical and theoretical
          knowledge of Engineering, Programming, Hardware and Software Systems With
          multidisciplinary approach.<br />
          • Grooming the graduates as professional problem solvers having ability to use
          technological advancements in Software Engineering, Information and Communication
          Technologies with global outlook.<br />
          • Inculcating employability skills, leadership qualities, entrepreneurial skills, innovation
          and research in collaboration with IT industry, academia and alumni.<br />
          • Imbibing professional ethics, social values and environmental awareness with a
          commitment for lifelong learning.
        </p>
      </div>

      <div>
        <h3 style={styles.subsectionTitle}>Program Educational Objectives</h3>
        <p style={styles.content}>
          Graduates of the Program will:<br />
          • Demonstrate breadth and depth of knowledge in Hardware, Software Systems and
          Programming to solve real-life problems.<br />
          • Exhibit analytical and design skills to develop sustainable solutions using modern
          tools and techniques with a focus on Software Development.<br />
          • Pursue higher education and research in emerging areas of Information Technology
          such as Data Science, Information and Network Security, Machine Learning and
          Artificial Intelligence applicable for professional development.<br />
          • Showcase leadership qualities and entrepreneurial skills with effective communication
          skills, teamwork, social values and passion for lifelong learning.
        </p>
      </div>

      <div>
        <h3 style={styles.subsectionTitle}>Program Specific Outcomes</h3>
        <p style={styles.content}>
          • Ability to apply standard Software Engineering practices in system development
          using different hardware and programming platforms.<br />
          • Analyze, design and develop efficient software applications in the areas related to
          Embedded Systems, IOT, Data Mining, Cloud Computing, Database Systems,
          Mobile and Web Technologies.
        </p>
      </div>
    </div>
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

        {/* New Success Stories and Vision & Mission Section */}
        <section style={styles.successVisionContainer}>
          {/* Left Vertical Carousel */}
          <div className="success-stories-carousel left" style={styles.successStoriesSlider}>
            {renderSuccessStoryCard(successStories[leftIndex])}
          </div>

          {/* Vision & Mission Section */}
          <div className="vision-mission-section" style={styles.visionMissionSection}>
            {renderVisionMission()}
          </div>

          {/* Right Vertical Carousel */}
          <div className="success-stories-carousel right" style={styles.successStoriesSlider}>
            {renderSuccessStoryCard(successStories[rightIndex])}
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="success-stories-section">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Our alumni are making waves across various industries worldwide</p>
          </div>
          <div className="success-stories-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            {successStories.map(story => (
              <div className="success-story-card" key={story.id} style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(26,42,108,0.10)', padding: '2rem 1.5rem', maxWidth: 340, minWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.3s, transform 0.3s' }}>
                <div className="story-image" style={{ marginBottom: 18 }}>
                  <img src={story.image} alt={story.name} style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: '50%', border: '4px solid #4e54c8', boxShadow: '0 2px 12px #4e54c822' }} />
                </div>
                <div className="story-content" style={{ textAlign: 'center' }}>
                  <h4 style={{ fontWeight: 700, color: '#4e54c8', marginBottom: 4 }}>{story.name}</h4>
                  <p className="story-year" style={{ fontWeight: 500, color: '#888', marginBottom: 2 }}>{story.year}</p>
                  <p className="story-company" style={{ fontWeight: 600, color: '#222', marginBottom: 10 }}>{story.company}</p>
                  <p className="story-description" style={{ fontSize: '1rem', color: '#444', lineHeight: 1.5 }}>{story.story}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta" style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/directory1" className="cta-button" style={{ borderRadius: 24, background: '#4e54c8', color: '#fff', padding: '0.8em 2.2em', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 12px #4e54c822', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', transition: 'background 0.2s' }}>View All Alumni <FaArrowRight /></Link>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="vision-mission-section">
          <div className="section-header">
            <h2 className="section-title">Vision & Mission</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="article-container">
            <div className="article-content">
              <div className="image-side">
                <img src={pimg} alt="Campus" className="photo-image" />
              </div>
              <div className="text-side">
                <div className="vision-box">
                  <h4>Vision</h4>
                  <p>
                    To be one of the leading Institutions for Engineering education
                    developing proficient Engineers with global acceptance in the
                    service of mankind.
                  </p>
                </div>
                <div className="mission-box">
                  <h4>Mission</h4>
                  <p>
                    Providing quality Engineering education to cater the needs of
                    industry and society with multidisciplinary approach on
                    sustainable basis. Developing globally competent Engineers having
                    ability to solve real-life problems addressing environmental
                    issues through technological advancements. Inculcating
                    professionalism, teamwork, research, innovation and
                    entrepreneurship, maintaining the spirit of continuous learning.
                    Fostering the collaboration with industry, academia, research
                    organizations, experts and alumni. Imparting employability
                    skills, nurturing leadership qualities with ethical and social
                    values among students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}
