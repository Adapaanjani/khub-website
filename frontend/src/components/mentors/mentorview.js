import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './mentorview.css';

const MentorView = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { batchNumber } = useParams();

  useEffect(() => {
    fetchBatchData();
  }, [batchNumber]);

  const fetchBatchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/batches/${batchNumber}`);
      const batch = response.data;

      // Extract the mentors from each team in the batch
      const batchMentors = batch.teams.map(team => team.teamMentor);
      setMentors(batchMentors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batch data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading mentors for Batch {batchNumber}...</p>;
  }

  return (
    <div className="mentor-container">
      <h2>Mentors from Batch {batchNumber}</h2>
      {mentors.length === 0 ? (
        <p>No mentors found for Batch {batchNumber}.</p>
      ) : (
        <div className="mentor-grid">
          {mentors.map((mentor, index) => (
            <div key={index} className="mentor-card">
              {mentor.image && (
                <img
                  src={`data:image/jpeg;base64,${mentor.image}`}
                  alt={mentor.name}
                  className="mentor-image"
                />
              )}
              <h3>{mentor.name}</h3>
              <p><strong>Team:</strong> {index + 1}</p>
              <div className="mentor-icons">
                {mentor.git && (
                  <a href={mentor.git} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                  </a>
                )}
                {mentor.linkedin && (
                  <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorView;
