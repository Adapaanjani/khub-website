import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './mentorbatch.css';  

const MentorBatch = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/batches');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  return (
    <div className="mentor-batch-container">
      <h2>Mentor Batches</h2>
      <div className="mentor-batch-grid">
        {batches.map((batch, index) => (
          <Link key={index} to={`/mentors/${batch.batchNumber}`} className="mentor-batch-link">
            <div className="mentor-batch-card">
              <h3>Batch {batch.batchNumber}</h3>
              <p>Click to view mentors</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MentorBatch;
