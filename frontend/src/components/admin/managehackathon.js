import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5000';

const ManageHackathon = () => {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/hackathons`);
      if (response.ok) {
        const data = await response.json();
        setHackathons(data);
      } else {
        console.error('Failed to fetch hackathons');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleHackathonClick = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/hackathons/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedHackathon(data);
        setEditMode(false);
      } else {
        console.error('Failed to fetch hackathon details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('hackathon', JSON.stringify(selectedHackathon));

      // Append team photos if they've been changed
      selectedHackathon.teams.forEach((team, index) => {
        if (team.newTeamPhoto) {
          formData.append(`teamPhotos`, team.newTeamPhoto, `team_${index}_photo`);
        }
      });

      const response = await fetch(`${BACKEND_URL}/api/hackathons/${selectedHackathon._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedHackathon = await response.json();
        setSelectedHackathon(updatedHackathon);
        setEditMode(false);
        fetchHackathons(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error('Failed to update hackathon:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this hackathon?')) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/hackathons/${selectedHackathon._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setSelectedHackathon(null);
          fetchHackathons(); // Refresh the list
        } else {
          console.error('Failed to delete hackathon');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleInputChange = (e, field) => {
    setSelectedHackathon({ ...selectedHackathon, [field]: e.target.value });
  };

  const handleTeamInputChange = (e, teamIndex, field) => {
    const updatedTeams = [...selectedHackathon.teams];
    updatedTeams[teamIndex][field] = e.target.value;
    setSelectedHackathon({ ...selectedHackathon, teams: updatedTeams });
  };

  const handleMemberInputChange = (e, teamIndex, memberIndex, field) => {
    const updatedTeams = [...selectedHackathon.teams];
    updatedTeams[teamIndex].members[memberIndex][field] = e.target.value;
    setSelectedHackathon({ ...selectedHackathon, teams: updatedTeams });
  };

  const handlePhotoChange = (e, teamIndex) => {
    const updatedTeams = [...selectedHackathon.teams];
    updatedTeams[teamIndex].newTeamPhoto = e.target.files[0];
    setSelectedHackathon({ ...selectedHackathon, teams: updatedTeams });
  };

  return (
    <div>
      <h2>Manage Hackathons</h2>
      <div>
        {hackathons.map((hackathon) => (
          <button key={hackathon._id} onClick={() => handleHackathonClick(hackathon._id)}>
            {hackathon.name}
          </button>
        ))}
      </div>
      {selectedHackathon && (
        <div>
          <h3>{selectedHackathon.name}</h3>
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={selectedHackathon.name}
                      onChange={(e) => handleInputChange(e, 'name')}
                    />
                  ) : (
                    selectedHackathon.name
                  )}
                </td>
              </tr>
              <tr>
                <td>Date:</td>
                <td>
                  {editMode ? (
                    <input
                      type="date"
                      value={selectedHackathon.date.split('T')[0]}
                      onChange={(e) => handleInputChange(e, 'date')}
                    />
                  ) : (
                    new Date(selectedHackathon.date).toLocaleDateString()
                  )}
                </td>
              </tr>
              <tr>
                <td>Technology:</td>
                <td>
                  {editMode ? (
                    <input
                      type="text"
                      value={selectedHackathon.technology}
                      onChange={(e) => handleInputChange(e, 'technology')}
                    />
                  ) : (
                    selectedHackathon.technology
                  )}
                </td>
              </tr>
              <tr>
                <td>Description:</td>
                <td>
                  {editMode ? (
                    <textarea
                      value={selectedHackathon.description}
                      onChange={(e) => handleInputChange(e, 'description')}
                    />
                  ) : (
                    selectedHackathon.description
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <h4>Teams</h4>
          {selectedHackathon.teams.map((team, teamIndex) => (
            <div key={teamIndex}>
              <h5>Team {teamIndex + 1}</h5>
              <table>
                <tbody>
                  <tr>
                    <td>Project Name:</td>
                    <td>
                      {editMode ? (
                        <input
                          type="text"
                          value={team.projectName}
                          onChange={(e) => handleTeamInputChange(e, teamIndex, 'projectName')}
                        />
                      ) : (
                        team.projectName
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>GitHub Link:</td>
                    <td>
                      {editMode ? (
                        <input
                          type="url"
                          value={team.githubLink}
                          onChange={(e) => handleTeamInputChange(e, teamIndex, 'githubLink')}
                        />
                      ) : (
                        <a href={team.githubLink} target="_blank" rel="noopener noreferrer">
                          {team.githubLink}
                        </a>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Team Photo:</td>
                    <td>
                      <img
                        src={`${BACKEND_URL}/api/hackathons/${selectedHackathon._id}/team/${team._id}/photo`}
                        alt={`Team ${teamIndex + 1}`}
                        style={{ maxWidth: '200px' }}
                      />
                      {editMode && (
                        <input
                          type="file"
                          onChange={(e) => handlePhotoChange(e, teamIndex)}
                        />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Members:</td>
                    <td>
                      {team.members.map((member, memberIndex) => (
                        <div key={memberIndex}>
                          {editMode ? (
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => handleMemberInputChange(e, teamIndex, memberIndex, 'name')}
                            />
                          ) : (
                            member.name
                          )}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          {editMode ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ManageHackathon;