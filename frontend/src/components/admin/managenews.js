import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageNews.css'; // Import CSS file for styling

const ManageNews = () => {
  const [allNews, setAllNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNews, setEditedNews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setAllNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleNewsSelect = (event) => {
    const selected = allNews.find(news => news._id === event.target.value);
    setSelectedNews(selected);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedNews({ ...selectedNews });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/news/${selectedNews._id}`);
        fetchNews();
        setSelectedNews(null);
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...editedNews.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditedNews({ ...editedNews, items: updatedItems });
  };

  const handleFileChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedItems = [...editedNews.items];
      updatedItems[index].value = reader.result;
      setEditedNews({ ...editedNews, items: updatedItems });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('items', JSON.stringify(editedNews.items));
      editedNews.items.forEach((item, index) => {
        if (item.type === 'image' && item.file) {
          formData.append('image', item.file);
        }
      });

      await axios.put(`http://localhost:5000/api/news/${editedNews._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchNews();
      setIsEditing(false);
      setSelectedNews(editedNews);
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  return (
    <div className="manage-news">
      <h5>.</h5>
      <h2>Manage News</h2>
      <button className="back-button" onClick={() => navigate('/admin')}>Back</button>
      <select onChange={handleNewsSelect} value={selectedNews?._id || ''}>
        <option value="">Select a news item</option>
        {allNews.map(news => (
          <option key={news._id} value={news._id}>
            {new Date(news.createdAt).toLocaleDateString()} - {news.items.find(item => item.type === 'title')?.value || 'Untitled'}
          </option>
        ))}
      </select>

      {selectedNews && (
        <div>
          <h3>Selected News</h3>
          {isEditing ? (
            <div>
              {editedNews.items.map((item, index) => (
                <div key={index} className="news-item">
                  <strong>{item.type}:</strong>
                  {item.type === 'image' ? (
                    <input
                      type="file"
                      onChange={(e) => {
                        handleFileChange(index, e.target.files[0]);
                        const updatedItems = [...editedNews.items];
                        updatedItems[index].file = e.target.files[0];
                        setEditedNews({ ...editedNews, items: updatedItems });
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                    />
                  )}
                </div>
              ))}
              <button className="save-button" onClick={handleSave}>Save</button>
              <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              {selectedNews.items.map((item, index) => (
                <div key={index} className="news-item">
                  <strong>{item.type}:</strong> {item.type === 'image' ? <img src={item.value} alt="News" style={{maxWidth: '200px'}} /> : item.value}
                </div>
              ))}
              <button className="edit-button" onClick={handleEdit}>Edit</button>
              <button className="delete-button" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageNews;
