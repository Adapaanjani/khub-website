import React from 'react';
import { Link } from 'react-router-dom';
import './adminpage.css'; 

const AdminPage = () => {
  return (
    <div className="adminpage-container">
      
      <div className="adminpage-card-container">
        <Link to="/addbatch" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-users"></i>
          <h3>Add Batch</h3>
        </Link>
        <Link to="/managebatch" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-users-slash"></i>
          <h3>Manage Batch</h3>
        </Link>
        <Link to="/addevent" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-calendar-alt"></i>
          <h3>Add Event</h3>
        </Link>
        <Link to="/manageevent" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-tasks"></i>
          <h3>Manage Event</h3>
        </Link>
        <Link to="/addhackathon" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-code"></i>
          <h3>Add Hackathon</h3>
        </Link>
        <Link to="/managehackathon" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-table"></i>
          <h3>Manage hackathon</h3>
        </Link>
        <Link to="/addachivements" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-table"></i>
          <h3>Add Achievement</h3>
        </Link>
        <Link to="/manageachivements" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-table"></i>
          <h3>Manage Achievement</h3>
        </Link>
        <Link to="/addnews" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-table"></i>
          <h3>Add News</h3>
        </Link>
        <Link to="/managenews" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-table"></i>
          <h3>Manage News</h3>
        </Link>
        <Link to="/addproject" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-table"></i>
          <h3>Add Project</h3>
        </Link>
        <Link to="/manageproject" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-table"></i>
          <h3>Manage Project</h3>
        </Link>
        <Link to="/addmember" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-user-plus"></i>
          <h3>Add Member</h3>
        </Link>
        <Link to="/addteam" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-users-cog"></i>
          <h3>Add Team</h3>
        </Link>
        <Link to="/addposter" className="adminpage-card">
          <div className="ribbon"><span>K-HUB</span></div>
          <i className="fas fa-table"></i>
          <h3>Add Poster</h3>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;