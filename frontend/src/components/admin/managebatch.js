import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './managebatch.css'; // Ensure this is the correct path to your CSS file

const ManageBatch = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/batches');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleBatchChange = async (e) => {
    const batchNumber = e.target.value;
    setSelectedBatch(batchNumber);
    if (batchNumber) {
      try {
        const selectedBatchData = batches.find(batch => batch.batchNumber === batchNumber);
        if (selectedBatchData) {
          setTeams(selectedBatchData.teams || []);
        } else {
          setTeams([]);
        }
        setSelectedTeam(null);
        setTeamData(null);
      } catch (error) {
        console.error('Error setting teams:', error);
      }
    } else {
      setTeams([]);
      setSelectedTeam(null);
      setTeamData(null);
    }
  };

  const handleTeamClick = async (teamNumber) => {
    setSelectedTeam(teamNumber);
    try {
      const response = await axios.get(`http://localhost:5000/api/teams/batch/${selectedBatch}/${teamNumber}`);
      setTeamData(response.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const handleEdit = (member, role) => {
    setEditingMember({ ...member, role });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMember(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingMember(prev => ({ ...prev, image: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async () => {
    try {
      let updatedTeam = { ...teamData };
      if (editingMember.role === 'teamLeader') {
        updatedTeam.teamLeader = editingMember;
      } else if (editingMember.role === 'teamMentor') {
        updatedTeam.teamMentor = editingMember;
      } else {
        updatedTeam.members = teamData.members.map(member => 
          member._id === editingMember._id ? editingMember : member
        );
      }

      await axios.put(`http://localhost:5000/api/teams/${selectedBatch}/${selectedTeam}`, updatedTeam);
      setEditingMember(null);
      // Refresh team data
      handleTeamClick(selectedTeam);
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  const deleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/teams/${selectedBatch}/${selectedTeam}/${memberId}`);
      // Refresh team data
      handleTeamClick(selectedTeam);
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/teams/${selectedBatch}/${selectedTeam}`);
      setSelectedTeam(null);
      setTeamData(null);
      // Refresh batches and teams
      fetchBatches();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleDeleteBatch = async () => {
    if (!window.confirm('Are you sure you want to delete this batch?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/batches/${selectedBatch}`);
      setSelectedBatch('');
      setTeams([]);
      setSelectedTeam(null);
      setTeamData(null);
      // Refresh batches
      fetchBatches();
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const renderMemberRow = (member, role) => {
    if (!member) return null;
    return (
      <tr key={member._id || role}>
        {editingMember && editingMember._id === member._id ? (
          <>
            <td><input name="name" value={editingMember.name || ''} onChange={handleInputChange} className="managebatch-input" /></td>
            <td>{role}</td>
            <td><input name="subteam" value={editingMember.subteam || ''} onChange={handleInputChange} className="managebatch-input" /></td>
            <td><input name="git" value={editingMember.git || ''} onChange={handleInputChange} className="managebatch-input" /></td>
            <td><input name="linkedin" value={editingMember.linkedin || ''} onChange={handleInputChange} className="managebatch-input" /></td>
            <td>
              <input type="file" accept="image/*" onChange={handleImageChange} className="managebatch-input" />
              {editingMember.image && (
                <img src={`data:image/jpeg;base64,${editingMember.image}`} alt="Preview" className="managebatch-img" />
              )}
            </td>
            <td>
              <button onClick={handleSaveEdit} className="managebatch-button save">Save</button>
              <button onClick={handleCancelEdit} className="managebatch-button cancel">Cancel</button>
            </td>
          </>
        ) : (
          <>
            <td>{member.name || ''}</td>
            <td>{role}</td>
            <td>{member.subteam || ''}</td>
            <td>{member.git || ''}</td>
            <td>{member.linkedin || ''}</td>
            <td>
              {member.image && <img src={`data:image/jpeg;base64,${member.image}`} alt={member.name} className="managebatch-img" />}
            </td>
            <td>
              <button onClick={() => handleEdit(member, role)} className="managebatch-button">Edit</button>
              {role !== 'teamLeader' && role !== 'teamMentor' && (
                <button onClick={() => deleteMember(member._id)} className="managebatch-button delete">Delete</button>
              )}
            </td>
          </>
        )}
      </tr>
    );
  };

  return (
    <div className="managebatch-div">
      <h1 className="managebatch-h1">Manage Batch</h1>
      <select value={selectedBatch} onChange={handleBatchChange} className="managebatch-select">
        <option value="">Select a batch</option>
        {batches.map(batch => (
          <option key={batch.batchNumber} value={batch.batchNumber}>
            Batch {batch.batchNumber}
          </option>
        ))}
      </select>

      {selectedBatch && (
        <div>
          <h2 className="managebatch-h2">Teams for Batch {selectedBatch}</h2>
          {teams.map((team, index) => (
            <button key={index} onClick={() => handleTeamClick(index + 1)} className="managebatch-button team">
              Team {index + 1}
            </button>
          ))}
          <button onClick={handleDeleteBatch} className="managebatch-button delete">Delete Batch</button>
        </div>
      )}

      {selectedTeam && teamData && (
        <div>
          <h3 className="managebatch-h3">Team {selectedTeam} Details</h3>
          <table className="managebatch-table">
            <thead className="managebatch-thead">
              <tr>
                <th className="managebatch-th">Name</th>
                <th className="managebatch-th">Role</th>
                <th className="managebatch-th">Subteam</th>
                <th className="managebatch-th">Git</th>
                <th className="managebatch-th">LinkedIn</th>
                <th className="managebatch-th">Image</th>
                <th className="managebatch-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamData.teamLeader && renderMemberRow(teamData.teamLeader, 'teamLeader')}
              {teamData.teamMentor && renderMemberRow(teamData.teamMentor, 'teamMentor')}
              {teamData.members && teamData.members.map(member => renderMemberRow(member, member.role || 'member'))}
            </tbody>
          </table>
          <button onClick={handleDeleteTeam} className="managebatch-button delete">Delete Team</button>
        </div>
      )}
    </div>
  );
};

export default ManageBatch;
