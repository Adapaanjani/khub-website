import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LatestAchievement = () => {
  const [latestAchievement, setLatestAchievement] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/achievements');
        if (response.data.length > 0) {
          // Assuming the latest achievement is the last item in the array
          setLatestAchievement(response.data[response.data.length - 1]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>View Achievements</h2>
      {latestAchievement ? (
        <div key={latestAchievement._id}>
          <h3>{latestAchievement.title}</h3>
          <img src={`data:image/jpeg;base64,${latestAchievement.image}`} alt={latestAchievement.title} style={{ maxWidth: '200px' }} />
          <p>{latestAchievement.description}</p>
          <p>Created At: {new Date(latestAchievement.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No achievements found.</p>
      )}
    </div>
  );
};

export default LatestAchievement;
