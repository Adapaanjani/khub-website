import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './viewhackathons.css';
import FullHackathon from './fullhackathon';

const BACKEND_URL = 'http://localhost:5000';

const ViewHackathon = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/hackathons`);
        setHackathons(response.data);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      }
    };

    fetchHackathons();
  }, []);

  const handleCardClick = (hackathon) => {
    setSelectedHackathon(hackathon);
  };

  return (
    <div>
      <h3>.</h3>
      <h1 className='heading'>Hackathons</h1>
      <div className="hackathon-list">
        {selectedHackathon ? (
          <FullHackathon hackathon={selectedHackathon} onBack={() => setSelectedHackathon(null)} />
        ) : (
          hackathons.length > 0 ? (
            hackathons.map((hackathon) => (
              <div key={hackathon._id} className="hackathon-card" onClick={() => handleCardClick(hackathon)}>
                <h2>{hackathon.name}</h2>
                <p><strong>Date:</strong> {new Date(hackathon.date).toLocaleDateString()}</p>
                <p><strong>Technology:</strong> {hackathon.technology}</p>
              </div>
            ))
          ) : (
            <p>No hackathons found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ViewHackathon;
