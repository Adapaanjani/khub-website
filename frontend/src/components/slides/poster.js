import React, { useState } from 'react';
import axios from 'axios';

function AddPoster({ onPosterAdded }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('poster', file);

    try {
      await axios.post('http://localhost:5000/api/posters', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Poster uploaded successfully');
      if (onPosterAdded) onPosterAdded();
    } catch (error) {
      console.error('Error uploading poster:', error);
      alert('Error uploading poster');
    }
  };

  return (
    <div>
      <h2>Add New Poster</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Upload Poster</button>
      </form>
    </div>
  );
}

export default AddPoster;