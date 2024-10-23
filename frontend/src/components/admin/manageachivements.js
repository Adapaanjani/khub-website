import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageAchievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch achievements from the backend
  const fetchAchievements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/achievements');
      setAchievements(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements(); // Initial fetch of achievements
  }, []);

  // Handle edit mode for an achievement
  const handleEdit = (id) => {
    setEditingId(id);
  };

  // Save changes to an achievement
  const handleSave = async (id) => {
    // Find the achievement being edited
    const achievementToEdit = achievements.find((achievement) => achievement._id === id);

    const formData = new FormData();
    formData.append('title', achievementToEdit.title);
    formData.append('description', achievementToEdit.description);
    if (achievementToEdit.newImage) {
      formData.append('image', achievementToEdit.newImage);
    }

    try {
      // Send update request to backend
      const response = await axios.put(`http://localhost:5000/api/achievements/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update achievements state with updated data
      setAchievements(achievements.map((achievement) => (achievement._id === id ? response.data.updatedAchievement : achievement)));
      // Reset editing state
      setEditingId(null);
    } catch (error) {
      console.error('Error updating achievement:', error);
      // Handle error
    }
  };

  // Handle input change during editing
  const handleInputChange = (id, field, value) => {
    // Update achievement locally in state while editing
    setAchievements(
      achievements.map((achievement) =>
        achievement._id === id ? { ...achievement, [field]: value } : achievement
      )
    );
  };

  // Handle image change during editing
  const handleImageChange = (id, file) => {
    // Update image locally in state while editing
    setAchievements(
      achievements.map((achievement) =>
        achievement._id === id ? { ...achievement, newImage: file } : achievement
      )
    );
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    // Reset editing state without saving changes
    setEditingId(null);
    // Fetch achievements again to reset to original values
    fetchAchievements();
  };

  // Delete an achievement
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/achievements/${id}`);
      setAchievements(achievements.filter((achievement) => achievement._id !== id));
      console.log(`Deleted achievement with ID: ${id}`);
    } catch (error) {
      console.error('Error deleting achievement:', error);
      // Handle error
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Manage Achievements</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((achievement) => (
            <tr key={achievement._id}>
              <td>
                {editingId === achievement._id ? (
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => handleInputChange(achievement._id, 'title', e.target.value)}
                  />
                ) : (
                  achievement.title
                )}
              </td>
              <td>
                {editingId === achievement._id ? (
                  <input
                    type="text"
                    value={achievement.description}
                    onChange={(e) => handleInputChange(achievement._id, 'description', e.target.value)}
                  />
                ) : (
                  achievement.description
                )}
              </td>
              <td>{new Date(achievement.createdAt).toLocaleDateString()}</td>
              <td>
                {editingId === achievement._id ? (
                  <>
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(achievement._id, e.target.files[0])}
                    />
                    {achievement.image && (
                      <img
                        src={`data:image/jpeg;base64,${achievement.image}`}
                        alt="Achievement"
                        style={{ width: '100px', height: '100px' }}
                      />
                    )}
                  </>
                ) : (
                  achievement.image && (
                    <img
                      src={`data:image/jpeg;base64,${achievement.image}`}
                      alt="Achievement"
                      style={{ width: '100px', height: '100px' }}
                    />
                  )
                )}
              </td>
              <td>
                {editingId === achievement._id ? (
                  <>
                    <button onClick={() => handleSave(achievement._id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(achievement._id)}>Edit</button>
                    <button onClick={() => handleDelete(achievement._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAchievement;
