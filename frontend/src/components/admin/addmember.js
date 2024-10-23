import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addmember.css'; // Import the CSS file

const AddMember = () => {
  const [batches, setBatches] = useState([]);
  const [latestBatch, setLatestBatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Senior Developer',
    subteam: 'a',
    git: '',
    linkedin: '',
    image: null
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/batches');
      setBatches(response.data);
      if (response.data.length > 0) {
        setLatestBatch(response.data[response.data.length - 1]); // Assuming the latest batch is the last one in the list
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setNewMember({ ...newMember, [field]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewMember({ ...newMember, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      alert('Please select a team');
      return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(newMember));
    if (newMember.image) {
      formData.append('image', newMember.image);
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/teams/${latestBatch.batchNumber}/${selectedTeam}/member`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Member added:', response.data);
      alert('Member added successfully');
      setNewMember({
        name: '',
        role: 'Senior Developer',
        subteam: 'a',
        git: '',
        linkedin: '',
        image: null
      });
      setSelectedTeam('');
      fetchBatches(); // Refresh the batch data
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member');
    }
  };

  const renderMemberForm = () => (
    <div>
      <input
        type="text"
        value={newMember.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Name"
        required
      />
      <select
        value={newMember.role}
        onChange={(e) => handleInputChange('role', e.target.value)}
        required
      >
        <option value="Senior Developer">Senior Developer</option>
        <option value="Junior Developer">Junior Developer</option>
        <option value="Other">Other</option>
      </select>
      <select
        value={newMember.subteam}
        onChange={(e) => handleInputChange('subteam', e.target.value)}
        required
      >
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
      </select>
      <input
        type="text"
        value={newMember.git}
        onChange={(e) => handleInputChange('git', e.target.value)}
        placeholder="GitHub"
      />
      <input
        type="text"
        value={newMember.linkedin}
        onChange={(e) => handleInputChange('linkedin', e.target.value)}
        placeholder="LinkedIn"
      />
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />
    </div>
  );

  const renderMemberDetails = (member) => (
    <div className="member-card">
      <p>Name: {member.name || 'N/A'}</p>
      <p>Role: {member.role || 'N/A'}</p>
      <p>Subteam: {member.subteam || 'N/A'}</p>
      <p>GitHub: {member.git || 'N/A'}</p>
      <p>LinkedIn: {member.linkedin || 'N/A'}</p>
      {member.image && (
        <img 
          src={`data:image/jpeg;base64,${member.image}`}
          alt={member.name} 
        />
      )}
    </div>
  );

  if (!latestBatch) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-member-container">
      <h2>Add Member to Latest Batch (Batch {latestBatch.batchNumber})</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          required
        >
          <option value="">Select Team</option>
          {latestBatch.teams.map((team, index) => (
            <option key={index} value={index + 1}>Team {index + 1}</option>
          ))}
        </select>

        {renderMemberForm()}

        <button type="submit">Add Member</button>
      </form>

      <h3>Current Teams in Batch {latestBatch.batchNumber}</h3>
      {latestBatch.teams.map((team, teamIndex) => (
        <div key={teamIndex} className="member-details">
          <h4>Team {teamIndex + 1}</h4>
          <div className="team-row">
            <div>
              <h5>Team Leader</h5>
              {renderMemberDetails(team.teamLeader)}
            </div>
            <div>
              <h5>Team Mentor</h5>
              {renderMemberDetails(team.teamMentor)}
            </div>
          </div>
          <h5>Team Members</h5>
          <div className="member-cards">
            {team.members.map((member, memberIndex) => (
              <div key={memberIndex} className="member-card">
                {renderMemberDetails(member)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddMember;
