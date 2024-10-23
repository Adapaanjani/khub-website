import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewproject.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const ViewProjects = () => {
  const [batchNumbers, setBatchNumbers] = useState([]);
  const [teamNumbers, setTeamNumbers] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects/batch-numbers')
      .then(response => {
        setBatchNumbers(response.data);
      })
      .catch(error => {
        console.error('Error fetching batch numbers:', error);
      });

    axios.get('http://localhost:5000/api/projects/team-numbers')
      .then(response => {
        setTeamNumbers(response.data);
      })
      .catch(error => {
        console.error('Error fetching team numbers:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedBatch !== '' || selectedTeam !== '') {
      axios.get(`http://localhost:5000/api/projects?batchNumber=${selectedBatch}&teamNumber=${selectedTeam}`)
        .then(response => {
          setProjects(response.data);
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
        });
    }
  }, [selectedBatch, selectedTeam]);

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
    setSelectedTeam('');
  };

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  return (
    <div className="view-projects-container">
      <h3>.</h3>
      <h2 className="heading">𝗣𝗥𝗢𝗝𝗘𝗖𝗧𝗦</h2>
      <p className="subheading">Explore into our projects which have been done by our Khub during their internships</p>
      <div className="select-container">
        <div className="select-card">
          <label>Select Batch Number:</label>
          <select value={selectedBatch} onChange={handleBatchChange}>
            <option value="">-- Select Batch --</option>
            {batchNumbers.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
        <div className="select-card">
          <label>Select Team Number:</label>
          <select value={selectedTeam} onChange={handleTeamChange}>
            <option value="">-- Select Team --</option>
            {teamNumbers.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="projects-container">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-info">
                <h3>{project.name}</h3>
                {project.previewImage && (
                  <div className="project-image">
                    <img 
                      src={`data:${project.previewImageType};base64,${project.previewImage}`} 
                      alt="Project Preview" 
                      className="preview-image"
                    />
                  </div>
                )}
                <div className="project-details">
                  <p><strong>Batch:</strong> {project.batchNumber}</p>
                  <p><strong>Team:</strong> {project.teamNumber}</p>
                  <p><strong>Developer:</strong> {project.developer}</p>
                  <p className="description-heading">Description:</p>
                  <p>{project.description}</p>
                  <div className="github-link">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faGithub} /> GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewProjects;
