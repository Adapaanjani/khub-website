import React, { useState } from 'react';
import axios from 'axios';
import './addteam.css';

const AddTeam = () => {
  const [teamData, setTeamData] = useState({
    teamLeader: { name: '', role: 'Lead', subteam: 'a', git: '', linkedin: '', image: null },
    teamMentor: { name: '', role: 'Mentor', subteam: 'a', git: '', linkedin: '', image: null },
    members: [{ name: '', role: 'Senior Developer', subteam: 'a', git: '', linkedin: '', image: null }]
  });

  const createEmptyMember = (defaultRole) => ({
    name: '',
    role: defaultRole,
    subteam: 'a',
    git: '',
    linkedin: '',
    image: null
  });

  const handleTeamLeaderChange = (field, value) => {
    setTeamData({ ...teamData, teamLeader: { ...teamData.teamLeader, [field]: value } });
  };

  const handleTeamMentorChange = (field, value) => {
    setTeamData({ ...teamData, teamMentor: { ...teamData.teamMentor, [field]: value } });
  };

  const handleMemberChange = (memberIndex, field, value) => {
    const newMembers = [...teamData.members];
    newMembers[memberIndex][field] = value;
    setTeamData({ ...teamData, members: newMembers });
  };

  const handleImageChange = (memberIndex, file, isLeader = false, isMentor = false) => {
    if (isLeader) {
      setTeamData({ ...teamData, teamLeader: { ...teamData.teamLeader, image: file } });
    } else if (isMentor) {
      setTeamData({ ...teamData, teamMentor: { ...teamData.teamMentor, image: file } });
    } else {
      const newMembers = [...teamData.members];
      newMembers[memberIndex].image = file;
      setTeamData({ ...teamData, members: newMembers });
    }
  };

  const addNewMember = () => {
    setTeamData({
      ...teamData,
      members: [...teamData.members, createEmptyMember('Senior Developer')]
    });
  };

  const removeMember = (memberIndex) => {
    const newMembers = [...teamData.members];
    newMembers.splice(memberIndex, 1);
    setTeamData({ ...teamData, members: newMembers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('data', JSON.stringify(teamData));

    teamData.members.forEach((member, memberIndex) => {
      if (member.image) {
        formData.append(`team_member_${memberIndex}_image`, member.image); // Fixed this line
      }
    });

    if (teamData.teamLeader.image) {
      formData.append('teamLeader_image', teamData.teamLeader.image);
    }

    if (teamData.teamMentor.image) {
      formData.append('teamMentor_image', teamData.teamMentor.image);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/teams/addTeam', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from server:', response.data);
      alert('Team added successfully!');
      setTeamData({
        teamLeader: { name: '', role: 'Lead', subteam: 'a', git: '', linkedin: '', image: null },
        teamMentor: { name: '', role: 'Mentor', subteam: 'a', git: '', linkedin: '', image: null },
        members: [{ name: '', role: 'Senior Developer', subteam: 'a', git: '', linkedin: '', image: null }]
      });
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Error adding team. Please try again.');
    }
  };

  const renderMemberForm = (member, memberIndex) => (
    <div key={memberIndex} className="team-member">
      <h4>Member {memberIndex + 1}</h4>
      <input
        type="text"
        value={member.name}
        onChange={(e) => handleMemberChange(memberIndex, 'name', e.target.value)}
        placeholder="Name"
        required
      />
      <select
        value={member.role}
        onChange={(e) => handleMemberChange(memberIndex, 'role', e.target.value)}
        required
      >
        <option value="Senior Developer">Senior Developer</option>
        <option value="Junior Developer">Junior Developer</option>
        {/* <option value="Other">Other</option> */}
      </select>
      <select
        value={member.subteam}
        onChange={(e) => handleMemberChange(memberIndex, 'subteam', e.target.value)}
        required
      >
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d">D</option>
      </select>
      <input
        type="text"
        value={member.git}
        onChange={(e) => handleMemberChange(memberIndex, 'git', e.target.value)}
        placeholder="GitHub"
      />
      <input
        type="text"
        value={member.linkedin}
        onChange={(e) => handleMemberChange(memberIndex, 'linkedin', e.target.value)}
        placeholder="LinkedIn"
      />
      <input
        type="file"
        onChange={(e) => handleImageChange(memberIndex, e.target.files[0])}
        accept="image/*"
      />
      <button type="button" onClick={() => removeMember(memberIndex)}>Remove Member</button>
    </div>
  );

  return (
    <div className="container">
      <h2>Add Team</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Team Leader</h3>
          <input
            type="text"
            value={teamData.teamLeader.name}
            onChange={(e) => handleTeamLeaderChange('name', e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="text"
            value={teamData.teamLeader.git}
            onChange={(e) => handleTeamLeaderChange('git', e.target.value)}
            placeholder="GitHub"
          />
          <input
            type="text"
            value={teamData.teamLeader.linkedin}
            onChange={(e) => handleTeamLeaderChange('linkedin', e.target.value)}
            placeholder="LinkedIn"
          />
          <input
            type="file"
            onChange={(e) => handleImageChange(null, e.target.files[0], true)}
            accept="image/*"
          />
        </div>

        <div className="form-section">
          <h3>Team Mentor</h3>
          <input
            type="text"
            value={teamData.teamMentor.name}
            onChange={(e) => handleTeamMentorChange('name', e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="text"
            value={teamData.teamMentor.git}
            onChange={(e) => handleTeamMentorChange('git', e.target.value)}
            placeholder="GitHub"
          />
          <input
            type="text"
            value={teamData.teamMentor.linkedin}
            onChange={(e) => handleTeamMentorChange('linkedin', e.target.value)}
            placeholder="LinkedIn"
          />
          <input
            type="file"
            onChange={(e) => handleImageChange(null, e.target.files[0], false, true)}
            accept="image/*"
          />
        </div>

        <div className="form-section">
          <h3>Team Members</h3>
          {teamData.members.map((member, memberIndex) => renderMemberForm(member, memberIndex))}
          <button type="button" onClick={addNewMember}>Add Member</button>
          <p>Members added: {teamData.members.length}</p>
        </div>
        <button type="submit">Submit Team</button>
      </form>
    </div>
  );
};

export default AddTeam;
