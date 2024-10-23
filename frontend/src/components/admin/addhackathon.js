import React, { useState } from 'react';
import './addhackathons.css';

const BACKEND_URL = 'http://localhost:5000';

const AddHackathon = () => {
  const [hackathon, setHackathon] = useState({
    name: '',
    date: '',
    technology: '',
    description: '',
    teams: [
      {
        projectName: '',
        members: [{ name: '' }],
        githubLink: '',
        teamPhoto: null,
      }
    ]
  });

  const handleHackathonChange = (e) => {
    const { name, value } = e.target;
    setHackathon({ ...hackathon, [name]: value });
  };

  const handleTeamChange = (index, e) => {
    const { name, value } = e.target;
    const teams = [...hackathon.teams];
    teams[index][name] = value;
    setHackathon({ ...hackathon, teams });
  };

  const handleMemberChange = (teamIndex, memberIndex, e) => {
    const { name, value } = e.target;
    const teams = [...hackathon.teams];
    teams[teamIndex].members[memberIndex][name] = value;
    setHackathon({ ...hackathon, teams });
  };

  const addMember = (teamIndex) => {
    const teams = [...hackathon.teams];
    teams[teamIndex].members.push({ name: '' });
    setHackathon({ ...hackathon, teams });
  };

  const removeMember = (teamIndex, memberIndex) => {
    const teams = [...hackathon.teams];
    teams[teamIndex].members.splice(memberIndex, 1);
    setHackathon({ ...hackathon, teams });
  };

  const handlePhotoChange = (teamIndex, e) => {
    const teams = [...hackathon.teams];
    teams[teamIndex].teamPhoto = e.target.files[0];
    setHackathon({ ...hackathon, teams });
  };

  const addTeam = () => {
    setHackathon({
      ...hackathon,
      teams: [...hackathon.teams, { projectName: '', members: [{ name: '' }], githubLink: '', teamPhoto: null }]
    });
  };

  const removeTeam = (teamIndex) => {
    const teams = [...hackathon.teams];
    teams.splice(teamIndex, 1);
    setHackathon({ ...hackathon, teams });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('hackathon', JSON.stringify(hackathon));
    
    hackathon.teams.forEach((team, index) => {
      if (team.teamPhoto) {
        formData.append('teamPhotos', team.teamPhoto);
      }
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/hackathons`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Hackathon added:', result);
        // Reset form or navigate to a different page
      } else {
        console.error('Failed to add hackathon');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hackathon-form">
      <div className="form-group">
        <h3>.</h3>
        <label>Hackathon Name:</label>
        <input
          type="text"
          name="name"
          value={hackathon.name}
          onChange={handleHackathonChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={hackathon.date}
          onChange={handleHackathonChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Technology:</label>
        <input
          type="text"
          name="technology"
          value={hackathon.technology}
          onChange={handleHackathonChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="description"
          value={hackathon.description}
          onChange={handleHackathonChange}
          required
        />
      </div>
      <h3>Teams</h3>
      {hackathon.teams.map((team, teamIndex) => (
        <div key={teamIndex} className="team-group">
          <h4>Team {teamIndex + 1}</h4>
          <div className="form-group">
            <label>Project Name:</label>
            <input
              type="text"
              name="projectName"
              value={team.projectName}
              onChange={(e) => handleTeamChange(teamIndex, e)}
              required
            />
          </div>
          <div className="form-group">
            <label>GitHub Link:</label>
            <input
              type="url"
              name="githubLink"
              value={team.githubLink}
              onChange={(e) => handleTeamChange(teamIndex, e)}
              required
            />
          </div>
          <div className="form-group">
            <label>Team Photo:</label>
            <input
              type="file"
              onChange={(e) => handlePhotoChange(teamIndex, e)}
              required
            />
          </div>
          <h5>Team Members</h5>
          {team.members.map((member, memberIndex) => (
            <div key={memberIndex} className="form-group member-group">
              <label>Member Name:</label>
              <input
                type="text"
                name="name"
                value={member.name}
                onChange={(e) => handleMemberChange(teamIndex, memberIndex, e)}
                required
              />
              <button type="button" onClick={() => removeMember(teamIndex, memberIndex)} className="remove-member">Remove Member</button>
            </div>
          ))}
          <button type="button" onClick={() => addMember(teamIndex)} className="add-member">Add Member</button>
          <button type="button" onClick={() => removeTeam(teamIndex)} className="remove-team">Remove Team</button>
        </div>
      ))}
      <button type="button" onClick={addTeam} className="add-team">Add Team</button>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default AddHackathon;
