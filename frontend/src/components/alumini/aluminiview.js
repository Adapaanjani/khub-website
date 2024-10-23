import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './aluminiview.css';

const AlumniView = () => {
  const [seniorDevs, setSeniorDevs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { batchNumber } = useParams();

  useEffect(() => {
    fetchBatchData();
  }, [batchNumber]);

  const fetchBatchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/batches/${batchNumber}`);
      const batch = response.data;

      // Filter out only senior developers from the batch data
      const seniorDevelopers = [];
      batch.teams.forEach((team, teamIndex) => {
        team.members.forEach(member => {
          if (member.role === 'Senior Developer') {
            seniorDevelopers.push({
              ...member,
              teamNumber: teamIndex + 1
            });
          }
        });
      });

      setSeniorDevs(seniorDevelopers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batch data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading senior developers for Batch {batchNumber}...</p>;
  }

  return (
    <div className="alumniv-container">
      <h5>.</h5>
      <h2 className="heading">Batch {batchNumber} - Senior Developers</h2>
      <button><Link to="/aluminibatch">Back</Link></button>
      {seniorDevs.length === 0 ? (
        <p>No senior developers found for Batch {batchNumber}.</p>
      ) : (
        <div className="alumniv-grid">
          {seniorDevs.map((developer, index) => (
            <div key={index} className="alumni-card">
              {developer.image && (
                <img
                  src={`data:image/jpeg;base64,${developer.image}`}
                  alt={developer.name}
                  className="alumniv-image"
                />
              )}
              <h3>{developer.name}</h3>
              <p><strong>Role:</strong> {developer.role}</p>
              <p><strong>Team:</strong> {developer.teamNumber}</p>
              <div className="alumniv-icons">
                {developer.git && (
                  <a href={developer.git} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i>
                  </a>
                )}
                {developer.linkedin && (
                  <a href={developer.linkedin} target="_blank" rel="noopener noreferrer">
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

export default AlumniView;
