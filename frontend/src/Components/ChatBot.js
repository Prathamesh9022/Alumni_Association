import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import './ChatBot.css';

const HELP_TOPICS = [
  {
    q: "I can't log in / forgot my password",
    a: "If you forgot your password, click the 'Forgot Password?' link on the login page. You'll receive an email with instructions to reset your password. If you don't receive the email, check your spam folder or contact support."
  },
  {
    q: "I can't register / registration not working",
    a: "Make sure you fill all required fields and use a valid email address. If you still can't register, the email may already be in use or your account may be pending approval."
  },
  {
    q: "I can't upload my profile photo",
    a: "Ensure your image is in JPG, PNG, or GIF format and is less than 2MB in size. If you still have issues, try a different browser or device."
  },
  {
    q: "I'm getting a validation error while filling the dashboard",
    a: "If you are having a validation issue/error at the time of filling the dashboard, please check the following:\n- In Education Details, the Year for 12th should be at least 15 years after your Date of Birth (DOB).\n- For Graduation, the Year should be at least 2 years after your 12th.\n- In the Project section, for Duration, just add the number (for example: 2, 3, 4, etc.)."
  },
  {
    q: "I can't find a mentor / mentee",
    a: "Use the search and filter options in the Mentorship section to find available mentors or mentees. If no results appear, there may be no available matches at the moment."
  },
  {
    q: "I can't post or view jobs",
    a: "Only alumni can post jobs. Students and alumni can view jobs in the Jobs section. If you don't see jobs, try refreshing the page or check your role."
  },
  {
    q: "I can't donate or download my donation receipt",
    a: "Go to the Donations section, fill out the form, and complete the payment. Receipts are available for download after a successful donation."
  },
  {
    q: "I'm not receiving email notifications",
    a: "Check your spam or junk folder. If you still don't receive emails, ensure your email address is correct in your profile."
  },
  {
    q: "Other / Not listed",
    a: "If your issue isn't listed, please describe your problem and our support team will assist you."
  }
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am your Alumni Assistant. How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [showHelpTopics, setShowHelpTopics] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleShowHelpTopics = () => {
    setShowHelpTopics(true);
    setMessages(prev => [
      ...prev,
      { from: 'bot', text: 'Here are some common issues. Click on any to get help:', helpTopics: true }
    ]);
  };

  const handleHelpTopicClick = (topic) => {
    setShowHelpTopics(false);
    setMessages(prev => [
      ...prev,
      { from: 'bot', text: topic.a }
    ]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const lower = userMsg.text.trim().toLowerCase();
      if (lower === 'hi' || lower === 'hello') {
        setShowHelpTopics(true);
        setMessages(prev => [
          ...prev,
          { from: 'bot', text: 'Here are some common issues. Click on any to get help:', helpTopics: true }
        ]);
      } else if (lower === 'help' || lower === 'see possible help') {
        handleShowHelpTopics();
      } else {
        // Try to match a help topic
        const found = HELP_TOPICS.find(topic => lower.includes(topic.q.toLowerCase().split(' ')[2]));
        if (found) {
          setShowHelpTopics(false);
          setMessages(prev => [
            ...prev,
            { from: 'bot', text: found.a }
          ]);
        } else {
          setShowHelpTopics(false);
          setMessages(prev => [
            ...prev,
            { from: 'bot', text: "Sorry, I did not understand that. Click 'See possible help' below to view common issues.", showHelpButton: true }
          ]);
        }
      }
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chatbot-widget">
      {open ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Alumni ChatBot</span>
            <button className="chatbot-close" onClick={() => setOpen(false)}><FaTimes /></button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg chatbot-msg-${msg.from}`}>
                {msg.text}
                {/* Show help topics as clickable buttons */}
                {msg.helpTopics && (
                  <div className="chatbot-help-topics mt-2">
                    {HELP_TOPICS.map((topic, i) => (
                      <button key={i} className="chatbot-help-btn" onClick={() => handleHelpTopicClick(topic)}>{topic.q}</button>
                    ))}
                  </div>
                )}
                {/* Show 'See possible help' button after an answer */}
                {msg.showHelpButton && (
                  <div className="mt-2">
                    <button className="chatbot-help-btn" onClick={handleShowHelpTopics}>See possible help</button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-row">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chatbot-send" onClick={sendMessage}><FaPaperPlane /></button>
          </div>
        </div>
      ) : (
        <button className="chatbot-fab" onClick={() => setOpen(true)}>
          <FaComments size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatBot; 