import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './viewachivements.css'; // Ensure the CSS file is imported

const ViewAchievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
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

    fetchAchievements();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="view-achievements-view-achievement">
      <h2 className='heading'>Achievements</h2>
      {achievements.length === 0 ? (
        <p>No achievements found.</p>
      ) : (
        <div className="achievement-list-view-achievement">
          {achievements.map((achievement) => (
            <div className="achievement-item-view-achievement" key={achievement._id}>
              <img 
                src={`data:image/jpeg;base64,${achievement.image}`} 
                alt={achievement.title} 
                onClick={() => handleImageClick(`data:image/jpeg;base64,${achievement.image}`)} 
              />
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>

            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Preview"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        {selectedImage && (
          <div className="image-preview">
            <button className="modal-close-button" onClick={closeModal}>&times;</button>
            <img src={selectedImage} alt="Preview" className="image-preview" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewAchievement;
