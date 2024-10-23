import React, { useState } from 'react';
import axios from 'axios';

const AddNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ type: '', value: '' });
  const buttons = ['title', 'subtitle', 'image', 'matter'];

  const handleButtonClick = (type) => {
    setCurrentItem({ type, value: '' });
  };

  const handleInputChange = (e) => {
    if (currentItem.type === 'image') {
      setCurrentItem({ ...currentItem, value: e.target.files[0] });
    } else {
      setCurrentItem({ ...currentItem, value: e.target.value });
    }
  };

  const handleAddItem = () => {
    if (currentItem.type && currentItem.value) {
      setNewsItems([...newsItems, currentItem]);
      setCurrentItem({ type: '', value: '' });
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      
      const itemsForJson = newsItems.map(item => 
        item.type === 'image' 
          ? { ...item, value: 'IMAGE_PLACEHOLDER' } 
          : item
      );
      formData.append('items', JSON.stringify(itemsForJson));

      const imageItem = newsItems.find(item => item.type === 'image');
      if (imageItem && imageItem.value instanceof File) {
        formData.append('image', imageItem.value, imageItem.value.name);
      }

      console.log('Sending items:', itemsForJson);
      console.log('FormData entries:', [...formData.entries()]);

      const response = await axios.post('http://localhost:5000/news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Server response:', response.data);
      alert('News items saved successfully!');
      setNewsItems([]);
    } catch (error) {
      console.error('Error saving news items:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      alert('Failed to save news items. Check console for details.');
    }
  };

  return (
    <div>
      <h2>Add Newsletter Content</h2>
      <div>
        {buttons.map((button) => (
          <button key={button} onClick={() => handleButtonClick(button)}>
            {button}
          </button>
        ))}
      </div>
      {currentItem.type && (
        <div>
          {currentItem.type === 'image' ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
            />
          ) : (
            <input
              type="text"
              placeholder={`Enter ${currentItem.type}`}
              value={currentItem.value}
              onChange={handleInputChange}
            />
          )}
          <button onClick={handleAddItem}>Add Item</button>
        </div>
      )}
      <div>
        <h3>Current Items:</h3>
        <ul>
          {newsItems.map((item, index) => (
            <li key={index}>
              {item.type}: {item.type === 'image' ? item.value.name : item.value}
            </li>
          ))}
        </ul>
      </div>
      {newsItems.length > 0 && (
        <button onClick={handleSubmit}>Save to Database</button>
      )}
    </div>
  );
};

export default AddNews;