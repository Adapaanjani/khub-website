import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './viewevent.css';

const ViewEvent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div className="view-event-container">
      <h5>.</h5>
      <h1 className="heading">Events</h1>
      <div className="event-grid">
        {events.map((event) => (
          <Link to={`/fullevents/${event._id}`} key={event._id} className="event-card">
            <div className="event-card-inner">
              <div className="event-card-front">
                <img
                  src={`data:image/jpeg;base64,${arrayBufferToBase64(event.mainPic.data)}`}
                  alt="Main Event"
                />
              </div>
              <div className="event-card-back">
                <h2>{event.name}</h2>
                <p>Click to know more</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ViewEvent;
