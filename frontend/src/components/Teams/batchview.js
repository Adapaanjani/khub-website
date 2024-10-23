import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './batchview.css';

const BatchView = () => {
  const [latestBatch, setLatestBatch] = useState(null);

  useEffect(() => {
    fetchAllBatches();
  }, []);

  const fetchAllBatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/batches'); // Fetch all batches
      const allBatches = response.data;
      if (allBatches.length > 0) {
        setLatestBatch(allBatches[0]); // Assuming batches are sorted in descending order, the first batch is the latest
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  if (!latestBatch) {
    return <p>Loading latest batch...</p>;
  }

  return (
    <div className="batch-view-container">
      <h2 className="batch-view-header">Latest Batch: {latestBatch.batchNumber}</h2>
      <h3 className="teams-heading">Teams</h3> {/* Added Teams Heading */}
      <div className="batch-view-card-container">
        {latestBatch.teams.map((team, index) => (
          <Link key={index} to={`/team/${index}`} className="batch-view-link">
            <div className="batch-view-card">
              <div className="batch-view-image">
                {team.teamLeader.image && (
                  <img
                    src={`data:image/jpeg;base64,${team.teamLeader.image}`}
                    alt={team.teamLeader.name}
                  />
                )}
              </div>
              <div className="batch-view-details">
                <h3>Team {index + 1}</h3>
                <p><strong>Team Leader:</strong> {team.teamLeader.name}</p>
                <p><strong>Senior Developers:</strong> {team.members.filter(member => member.role === 'Senior Developer').length}</p>
                <p><strong>Junior Developers:</strong> {team.members.filter(member => member.role === 'Junior Developer').length}</p>
                <p><strong>Mentor:</strong> {team.teamMentor.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BatchView;
