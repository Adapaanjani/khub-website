import React, { useState } from 'react';
import './navbar.css';
import { FaHome, FaCalendarAlt, FaProjectDiagram, FaTrophy, FaUsers, FaEnvelope, FaTasks, FaNewspaper } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false); // Close the sidebar on link click
  };

  const toggleEventsDropdown = () => {
    setEventsDropdownOpen(!eventsDropdownOpen);
  };

  const toggleTeamDropdown = () => {
    setTeamDropdownOpen(!teamDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/login">
          <img src="/khublogo1.png" alt="Brand Logo" className="navbar-logo" />
        </Link>
      </div>
      <input type="checkbox" id="checkbox" checked={menuOpen} onChange={toggleMenu} />
      <label htmlFor="checkbox" className="toggle">
        <div id="bar1" className="bars"></div>
        <div id="bar2" className="bars"></div>
        <div id="bar3" className="bars"></div>
      </label>
      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}><FaHome className="nav-icon" />Home</Link>
        <div className="dropdown" onMouseEnter={toggleEventsDropdown} onMouseLeave={toggleEventsDropdown}>
          <div className="nav-link">
            <FaCalendarAlt className="nav-icon" /> <span className="nav-text">Events</span>
          </div>
          <div className={`dropdown-content ${eventsDropdownOpen ? 'show' : ''}`}>
            <Link to="/viewhackathon" onClick={closeMenu}><FaTasks className="nav-icon" />Hackathon</Link>
            <Link to="/events" onClick={closeMenu}><FaCalendarAlt className="nav-icon" />Events</Link>
            <Link to="/news" onClick={closeMenu}><FaNewspaper className="nav-icon" />News</Link>
          </div>
        </div>

        <Link to="/viewproject" onClick={closeMenu}><FaProjectDiagram className="nav-icon" />Projects</Link>
        <Link to="/viewachivements" onClick={closeMenu}><FaTrophy className="nav-icon" />Achievements</Link>

        <div className="dropdown" onMouseEnter={toggleTeamDropdown} onMouseLeave={toggleTeamDropdown}>
          <div className="nav-link">
            <FaUsers className="nav-icon" /> <span className="nav-text">Team</span>
          </div>
          <div className={`dropdown-content ${teamDropdownOpen ? 'show' : ''}`}>
            <Link to="/aluminibatch" onClick={closeMenu}>Alumni</Link>
            <Link to="/mentorbatch" onClick={closeMenu}>Mentors</Link>
            <Link to="/teams" onClick={closeMenu}>Current Batch</Link>
            <Link to="/teams/previous" onClick={closeMenu}>Previous Batch</Link>
          </div>
        </div>

        <Link to="/contactus" onClick={closeMenu}><FaEnvelope className="nav-icon" />Contact Us</Link>
      </div>
    </nav>
  );
};

export default Navbar;
