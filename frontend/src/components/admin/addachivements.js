// AddAchievement.js
import React, { useState } from 'react';
import axios from 'axios';

const AddAchievement = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null); // Store image file object
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store selected file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!image) {
        setErrorMessage('Please select an image.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', image);
      formData.append('description', description);

      // Send POST request to backend
      const response = await axios.post('http://localhost:5000/api/achievements/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('New achievement added:', response.data);
      // Reset form fields
      setTitle('');
      setImage(null);
      setDescription('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding achievement:', error);
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to add achievement. Please try again later.');
      }
    }
  };

  return (
    <div>
      
      <h2>Add New Achievement</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Image:</label>
        <input type="file" onChange={handleFileChange} accept="image/*" required />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <button type="submit">Add Achievement</button>
      </form>
    </div>
  );
};

export default AddAchievement;
