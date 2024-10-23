import React from 'react';
import './landpage.css';
import Home from './home1';

const LandingPage = () => {
  return (
    <div>
      <div className="landing-page">
        <div className="left-container">
          <div className="content">
            <h1>𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐓𝐡𝐞 𝐊𝐇𝐔𝐁 - 𝐘𝐨𝐮𝐫 𝐆𝐚𝐭𝐞𝐰𝐚𝐲 𝐭𝐨 𝐈𝐧𝐧𝐨𝐯𝐚𝐭𝐢𝐨𝐧 𝐚𝐧𝐝 𝐂𝐨𝐥𝐥𝐚𝐛𝐨𝐫𝐚𝐭𝐢𝐨𝐧</h1>
          </div>
        </div>
        <div className="right-container">
          <img src='bulbpic.png' alt="Logo" className="logo" />
        </div>
      </div>
      <Home />
    </div>
  );
}

export default LandingPage;
