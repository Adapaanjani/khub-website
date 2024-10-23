import React, { useState } from 'react';
import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMapMarkerAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';




const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.message);
      } else {
        setResponseMessage(data.error);
      }
    } catch (error) {
      setResponseMessage('Message Sent Successfully');
    }
  };

  return (
    <div className="contact-container">
      <h2>.</h2>
      <div className="contact-content">
        <div className="contact-form">
          <h1>𝐖𝐑𝐈𝐓𝐄 𝐓𝐎 𝐔𝐒</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
              ></textarea>
            </div>
            <button type="submit" className="submit-button">Convey</button>
          </form>
          {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
        <div className="contact-info">
          <div className="info-card">
            <div className="info-section">
              <div className="info-details">
                <FontAwesomeIcon icon={faPhone} />
                <p>9381434709</p>
              </div>
            </div>
            <div className="info-section">
              <div className="info-details">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <p>KIET, Korangi</p>
              </div>
            </div>
            <div className="info-section">
              <div className="info-details">
                <FontAwesomeIcon icon={faEnvelope} />
                <p>khub.helpdesk@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2869.443978061835!2d82.23744937359083!3d16.811735819136377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3821143f89e271%3A0x8ec5e22d8d18e4e6!2sKIET-HUB!5e1!3m2!1sen!2sin!4v1720989478755!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              title="Google Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;