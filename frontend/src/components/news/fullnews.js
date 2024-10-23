import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useNavigate instead of useHistory
import axios from 'axios';
import './fullnews.css';  // Make sure to create this CSS file

const FullNewsletter = () => {
  const [newsletter, setNewsletter] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();  // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/news/${id}`);
        setNewsletter(response.data);
      } catch (error) {
        console.error('Error fetching newsletter:', error);
      }
    };

    fetchNewsletter();
  }, [id]);

  if (!newsletter) {
    return <div>Loading...</div>;
  }

  const onBack = () => {
    navigate('/news');  // Redirect to the /news page
  };

  return (
    <div className='bodyy'>
      .
      <div className="full-news">
      <button onClick={onBack} className="back-button">Back</button>
        <h2 className="newsletter-main-title">Newsletter</h2>
        <div className="newsletter-content">
          {newsletter.items.map((item, index) => (
            <div key={index} className="newsletter-card">
              {item.type === 'image' ? (
                <img src={item.value} alt="Newsletter content" className="newsletter-image" />
              ) : item.type === 'title' ? (
                <h3 className="newsletter-title">{item.value}</h3>
              ) : item.type === 'subtitle' ? (
                <h4 className="newsletter-subtitle">{item.value}</h4>
              ) : (
                <p className="newsletter-text">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullNewsletter;
