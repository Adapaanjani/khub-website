import React, { useState, useEffect } from 'react';
import './counts.css'; // Import your CSS file for styling

const Counts = () => {
  const [counts, setCounts] = useState({
    projects: 0,
    seniors: 0,
    juniors: 0,
    placedMembers: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prevCounts => ({
        projects: prevCounts.projects < 180 ? prevCounts.projects + 1 : 180,
        seniors: prevCounts.seniors < 50 ? prevCounts.seniors + 1 : 50,
        juniors: prevCounts.juniors < 40 ? prevCounts.juniors + 1 : 40,
        placedMembers: prevCounts.placedMembers < 30 ? prevCounts.placedMembers + 1 : 30
      }));
    }, 50); // Adjust the interval time (ms) for smoother animation or speed

    // Clean-up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="counts-container">
      <div className="count-card">
        <h2>ᴘʀᴏᴊᴇᴄᴛꜱ</h2>
        <h2>{counts.projects}+</h2>
      </div>
      <div className="count-card">
        <h2>ꜱᴇɴɪᴏʀꜱ</h2>
        <h2>{counts.seniors}+</h2>
      </div>
      <div className="count-card">
        <h2>ᴊᴜɴɪᴏʀꜱ</h2>
        <h2>{counts.juniors}+</h2>
      </div>
      <div className="count-card">
        <h2>ᴘʟᴀᴄᴇᴅ</h2>
        <h2>{counts.placedMembers}+</h2>
      </div>
    </div>
  );
};

export default Counts;
