import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './viewnews.css';

const ViewNews = () => {
  const [allNews, setAllNews] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setAllNews(response.data);
      const dates = [...new Set(response.data.map(news => news.createdAt.split('T')[0]))];
      setAvailableDates(dates);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const filteredNews = selectedDate
    ? allNews.filter(news => news.createdAt.startsWith(selectedDate))
    : allNews;

  const renderCard = (news) => {
    const title = news.items.find(item => item.type === 'title')?.value || 'No Title';
    const imageItem = news.items.find(item => item.type === 'image');
    const imageUrl = imageItem ? imageItem.value : null;

    return (
      <div 
        key={news._id} 
        className="news-card"
      >
        <Link to={`/news/${news._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>{title}</h3>
          <p className="date">Date: {new Date(news.createdAt).toLocaleDateString()}</p>
          {imageUrl && <img src={imageUrl} alt={title} className="news-image" />}
        </Link>
      </div>
    );
  };

  return (
    <div className="news-container">
      <h1 className="heading">Newsletters</h1>
      <select 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        <option value="">All Dates</option>
        {availableDates.map(date => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>
      <div className="news-list">
        {filteredNews.map(renderCard)}
      </div>
    </div>
  );
};

export default ViewNews;
