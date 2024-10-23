import React, { useState } from 'react';
import axios from 'axios';

const AddProject = () => {
  const [project, setProject] = useState({
    batchNumber: '',
    teamNumber: '',
    name: '',
    description: '',
    githubLink: '',
    developer: '',
    previewImage: null
  });

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProject({ ...project, previewImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('batchNumber', project.batchNumber);
    formData.append('teamNumber', project.teamNumber);
    formData.append('name', project.name);
    formData.append('description', project.description);
    formData.append('githubLink', project.githubLink);
    formData.append('developer', project.developer);
    if (project.previewImage) {
      formData.append('previewImage', project.previewImage);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/projects/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Project added successfully:', response.data);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  // Define inline styles
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '70px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const inputStyle = {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const textareaStyle = {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
    minHeight: '100px',
  };

  const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        name="batchNumber"
        placeholder="Batch Number"
        value={project.batchNumber}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <input
        type="number"
        name="teamNumber"
        placeholder="Team Number"
        value={project.teamNumber}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <input
        type="text"
        name="name"
        placeholder="Project Name"
        value={project.name}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <textarea
        name="description"
        placeholder="Project Description"
        value={project.description}
        onChange={handleChange}
        required
        style={textareaStyle}
      ></textarea>
      <input
        type="text"
        name="githubLink"
        placeholder="GitHub Link"
        value={project.githubLink}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <input
        type="text"
        name="developer"
        placeholder="Developer"
        value={project.developer}
        onChange={handleChange}
        required
        style={inputStyle}
      />
      <input
        type="file"
        name="previewImage"
        onChange={handleFileChange}
        style={inputStyle}
      />
      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
      >
        Add Project
      </button>
    </form>
  );
};

export default AddProject;
