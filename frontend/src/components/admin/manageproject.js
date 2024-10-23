import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manageproject.css';

const ManageProjects = () => {
  const [batchNumbers, setBatchNumbers] = useState([]);
  const [teamNumbers, setTeamNumbers] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedImages, setEditedImages] = useState({});

  useEffect(() => {
    // Fetch batch numbers
    axios.get('http://localhost:5000/api/projects/batch-numbers')
      .then(response => {
        setBatchNumbers(response.data);
      })
      .catch(error => {
        console.error('Error fetching batch numbers:', error);
      });

    // Fetch team numbers
    axios.get('http://localhost:5000/api/projects/team-numbers')
      .then(response => {
        setTeamNumbers(response.data);
      })
      .catch(error => {
        console.error('Error fetching team numbers:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch projects based on selected batch and team
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
    setSelectedTeam(''); // Reset team selection when batch changes
  };

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  const handleEdit = (projectId) => {
    setEditingProjectId(projectId);
  };

  const handleSave = (project) => {
    const formData = new FormData();
    formData.append('project', JSON.stringify(project));

    if (editedImages[project._id]) {
      formData.append('previewImage', editedImages[project._id]);
    }

    axios.put(`http://localhost:5000/api/projects/${project._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        setProjects(projects.map(p => (p._id === response.data._id ? response.data : p)));
        setEditingProjectId(null);
        setEditedImages({});
      })
      .catch(error => {
        console.error('Error updating project:', error);
      });
  };

  const handleDelete = (projectId) => {
    axios.delete(`http://localhost:5000/api/projects/${projectId}`)
      .then(() => {
        setProjects(projects.filter(project => project._id !== projectId));
      })
      .catch(error => {
        console.error('Error deleting project:', error);
      });
  };

  const handleInputChange = (e, projectId) => {
    const { name, value } = e.target;
    setProjects(projects.map(p => (p._id === projectId ? { ...p, [name]: value } : p)));
  };

  const handleImageChange = (e, projectId) => {
    const file = e.target.files[0];
    setEditedImages({ ...editedImages, [projectId]: file });
  };

  return (
    <div className="manage-projects">
      <h2>Manage Projects</h2>
      <div className="filters">
        <div className="filter-group">
          <label>Select Batch Number:</label>
          <select value={selectedBatch} onChange={handleBatchChange}>
            <option value="">-- Select Batch --</option>
            {batchNumbers.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Select Team Number:</label>
          <select value={selectedTeam} onChange={handleTeamChange}>
            <option value="">-- Select Team --</option>
            {teamNumbers.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="projects">
        <h3>Projects:</h3>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Github Link</th>
                <th>Developer</th>
                <th>Preview Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id}>
                  <td>
                    {editingProjectId === project._id ? (
                      <input type="text" name="name" value={project.name} onChange={(e) => handleInputChange(e, project._id)} />
                    ) : (
                      project.name
                    )}
                  </td>
                  <td>
                    {editingProjectId === project._id ? (
                      <textarea name="description" value={project.description} onChange={(e) => handleInputChange(e, project._id)} />
                    ) : (
                      project.description
                    )}
                  </td>
                  <td>
                    {editingProjectId === project._id ? (
                      <input type="url" name="githubLink" value={project.githubLink} onChange={(e) => handleInputChange(e, project._id)} />
                    ) : (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">{project.githubLink}</a>
                    )}
                  </td>
                  <td>
                    {editingProjectId === project._id ? (
                      <input type="text" name="developer" value={project.developer} onChange={(e) => handleInputChange(e, project._id)} />
                    ) : (
                      project.developer
                    )}
                  </td>
                  <td>
                    {editingProjectId === project._id ? (
                      <>
                        <input type="file" name="previewImage" onChange={(e) => handleImageChange(e, project._id)} />
                        {project.previewImage && (
                          <img 
                            src={`data:${project.previewImage.contentType};base64,${project.previewImage}`} 
                            alt="Preview" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                        )}
                      </>
                    ) : (
                      project.previewImage && (
                        <img 
                          src={`data:${project.previewImage.contentType};base64,${project.previewImage}`} 
                          alt="Preview" 
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      )
                    )}
                  </td>
                  <td>
                    {editingProjectId === project._id ? (
                      <button onClick={() => handleSave(project)}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(project._id)}>Edit</button>
                        <button onClick={() => handleDelete(project._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;
