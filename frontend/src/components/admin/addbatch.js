import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './addbatch.css';

const AddBatch = () => {
  const [batchData, setBatchData] = useState({
    batchNumber: '',
    teams: []
  });
  const [allBatches, setAllBatches] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    fetchAllBatches();
  }, []);

  const fetchAllBatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams/batches');
      setAllBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const createEmptyMember = (defaultRole) => ({
    name: '',
    role: defaultRole,
    subteam: 'a',
    git: '',
    linkedin: '',
    image: null
  });

  const createEmptyTeam = () => ({
    teamLeader: { ...createEmptyMember('Lead') },
    teamMentor: { ...createEmptyMember('Mentor') },
    members: [createEmptyMember('Senior Developer')]
  });

  const handleBatchChange = (e) => {
    setBatchData({ ...batchData, batchNumber: e.target.value });
  };

  const handleTeamLeaderChange = (teamIndex, field, value) => {
    const newTeams = [...batchData.teams];
    newTeams[teamIndex].teamLeader[field] = value;
    setBatchData({ ...batchData, teams: newTeams });
  };

  const handleTeamMentorChange = (teamIndex, field, value) => {
    const newTeams = [...batchData.teams];
    newTeams[teamIndex].teamMentor[field] = value;
    setBatchData({ ...batchData, teams: newTeams });
  };

  const handleMemberChange = (teamIndex, memberIndex, field, value) => {
    const newTeams = [...batchData.teams];
    newTeams[teamIndex].members[memberIndex][field] = value;
    setBatchData({ ...batchData, teams: newTeams });
  };

  const handleImageChange = (teamIndex, memberIndex, file, isLeader = false, isMentor = false) => {
    const newTeams = [...batchData.teams];
    if (isLeader) {
      newTeams[teamIndex].teamLeader.image = file;
    } else if (isMentor) {
      newTeams[teamIndex].teamMentor.image = file;
    } else {
      newTeams[teamIndex].members[memberIndex].image = file;
    }
    setBatchData({ ...batchData, teams: newTeams });
  };

  const addNewTeam = () => {
    setBatchData({
      ...batchData,
      teams: [...batchData.teams, createEmptyTeam()]
    });
  };

  const addNewMember = (teamIndex) => {
    const newTeams = [...batchData.teams];
    newTeams[teamIndex].members.push(createEmptyMember('Senior Developer'));
    setBatchData({ ...batchData, teams: newTeams });
  };

  const removeMember = (teamIndex, memberIndex) => {
    const newTeams = [...batchData.teams];
    newTeams[teamIndex].members.splice(memberIndex, 1);
    setBatchData({ ...batchData, teams: newTeams });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (batchData.teams.length === 0) {
      alert('Please add at least one team before submitting');
      return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(batchData));

    console.log('Batch data being sent:', batchData);

    batchData.teams.forEach((team, teamIndex) => {
      if (team.teamLeader.image) {
        console.log(`Team ${teamIndex} Leader Image:`, team.teamLeader.image);
        formData.append(`teamLeader_${teamIndex}_image`, team.teamLeader.image);
      }
      if (team.teamMentor.image) {
        console.log(`Team ${teamIndex} Mentor Image:`, team.teamMentor.image);
        formData.append(`teamMentor_${teamIndex}_image`, team.teamMentor.image);
      }
      team.members.forEach((member, memberIndex) => {
        if (member.image) {
          console.log(`Team ${teamIndex} Member ${memberIndex} Image:`, member.image);
          formData.append(`team_${teamIndex}_member_${memberIndex}_image`, member.image);
        }
      });
    });

    try {
      const response = await axios.post('http://localhost:5000/api/teams/batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from server:', response.data);
      alert('Batch added successfully!');
      setBatchData({
        batchNumber: '',
        teams: []
      });
      fetchAllBatches();
    } catch (error) {
      console.error('Error adding batch:', error);
      alert('Error adding batch. Please try again.');
    }
  };

  const renderMemberForm = (member, teamIndex, memberIndex) => (
    <div key={memberIndex} className="teamsadd-member-form">
      <input
        type="text"
        className="teamsadd-input"
        value={member.name}
        onChange={(e) => handleMemberChange(teamIndex, memberIndex, 'name', e.target.value)}
        placeholder="Name"
        required
      />
      <select
        className="teamsadd-select"
        value={member.role}
        onChange={(e) => handleMemberChange(teamIndex, memberIndex, 'role', e.target.value)}
        required
      >
        <option value="Senior Developer">Senior Developer</option>
        <option value="Junior Developer">Junior Developer</option>
        <option value="Other">Other</option>
      </select>
      <select
        className="teamsadd-select"
        value={member.subteam}
        onChange={(e) => handleMemberChange(teamIndex, memberIndex, 'subteam', e.target.value)}
        required
      >
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d">D</option>
      </select>
      <input
        type="text"
        className="teamsadd-input"
        value={member.git}
        onChange={(e) => handleMemberChange(teamIndex, memberIndex, 'git', e.target.value)}
        placeholder="GitHub"
      />
      <input
        type="text"
        className="teamsadd-input"
        value={member.linkedin}
        onChange={(e) => handleMemberChange(teamIndex, memberIndex, 'linkedin', e.target.value)}
        placeholder="LinkedIn"
      />
      <input
        type="file"
        className="teamsadd-input"
        onChange={(e) => handleImageChange(teamIndex, memberIndex, e.target.files[0])}
        accept="image/*"
      />
      <button type="button" className="teamsadd-button" onClick={() => removeMember(teamIndex, memberIndex)}>Remove Member</button>
    </div>
  );

  const renderTeamForm = (team, teamIndex) => (
    <div key={teamIndex} className="teamsadd-team-form">
      <h3>Team {teamIndex + 1}</h3>
      <h4>Team Leader</h4>
      <input
        type="text"
        className="teamsadd-input"
        value={team.teamLeader.name}
        onChange={(e) => handleTeamLeaderChange(teamIndex, 'name', e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="text"
        className="teamsadd-input"
        value={team.teamLeader.git}
        onChange={(e) => handleTeamLeaderChange(teamIndex, 'git', e.target.value)}
        placeholder="GitHub"
      />
      <input
        type="text"
        className="teamsadd-input"
        value={team.teamLeader.linkedin}
        onChange={(e) => handleTeamLeaderChange(teamIndex, 'linkedin', e.target.value)}
        placeholder="LinkedIn"
      />
      <input
        type="file"
        className="teamsadd-input"
        onChange={(e) => handleImageChange(teamIndex, null, e.target.files[0], true)}
        accept="image/*"
      />

      <h4>Team Mentor</h4>
      <input
        type="text"
        className="teamsadd-input"
        value={team.teamMentor.name}
        onChange={(e) => handleTeamMentorChange(teamIndex, 'name', e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="text"
        className="teamsadd-input"
        value={team.teamMentor.git}
        onChange={(e) => handleTeamMentorChange(teamIndex, 'git', e.target.value)}
        placeholder="GitHub"
      />
      <input
        type="text"
        className="teamsadd-input"
        value={team.teamMentor.linkedin}
        onChange={(e) => handleTeamMentorChange(teamIndex, 'linkedin', e.target.value)}
        placeholder="LinkedIn"
      />
      <input
        type="file"
        className="teamsadd-input"
        onChange={(e) => handleImageChange(teamIndex, null, e.target.files[0], false, true)}
        accept="image/*"
      />

      {team.members.map((member, memberIndex) => renderMemberForm(member, teamIndex, memberIndex))}

      <button type="button" className="teamsadd-button" onClick={() => addNewMember(teamIndex)}>Add New Member</button>
    </div>
  );

  return (
    <div className="teamsadd-container">
      <h1>.</h1>
      <button onClick={() => navigate(-1)} className="teamsadd-back-button">Back</button> {/* Back button */}
      <h1>Add New Batch</h1>
      <form onSubmit={handleSubmit} className="teamsadd-form">
        <input
          type="text"
          className="teamsadd-input"
          value={batchData.batchNumber}
          onChange={handleBatchChange}
          placeholder="Batch Number"
          required
        />
        {batchData.teams.map((team, index) => renderTeamForm(team, index))}
        <button type="button" className="teamsadd-button" onClick={addNewTeam}>Add New Team</button>
        <button type="submit" className="teamsadd-button">Submit</button>
      </form>
    </div>
  );
};

export default AddBatch;
