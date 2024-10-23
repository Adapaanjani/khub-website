import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './fullevent.css';

const FullEvent = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleImageClick = (images, index) => {
    setPreviewImage(images);
    setCurrentImageIndex(index);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? previewImage.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === previewImage.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fullevnt-container">
      
      <h4>.</h4>
      <h1 className='head'>{event.name}</h1>
      <button><Link to="/events">Back</Link></button>
      <img
        src={`data:image/jpeg;base64,${arrayBufferToBase64(event.mainPic.data)}`}
        alt="Main Event"
        className="cover-image"
      />
      <h2>Sub-events:</h2>
      {event.subEvents.map((subEvent, index) => (
        <div key={index} className="sub-event">
          <h3>{subEvent.name}</h3>
          <p className="sub-event-description">{subEvent.description}</p>
          <div className="sub-event-images">
            {subEvent.images.map((image, imgIndex) => (
              <img
                key={imgIndex}
                src={`data:image/jpeg;base64,${arrayBufferToBase64(image.data)}`}
                alt={`Sub-event ${index} Imagee ${imgIndex}`}
                onClick={() => handleImageClick(subEvent.images, imgIndex)}
              />
            ))}
          </div>
        </div>
      ))}
      {previewImage && (
        <div>
          <h1>Image-Prev</h1>
        <div className="image-preview">
          <button className="close-preview" onClick={handleClosePreview}>
            &times;
          </button>
          <button className="prev-image" onClick={handlePrevImage}>
            &lt;
          </button>
          <img
            src={`data:image/jpeg;base64,${arrayBufferToBase64(previewImage[currentImageIndex].data)}`}
            alt="Preview"
          />
          <button className="next-image" onClick={handleNextImage}>
            &gt;
          </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default FullEvent;
