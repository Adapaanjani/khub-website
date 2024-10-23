import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manageevent.css'
const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingSubEvent, setEditingSubEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleEventClick = async (eventId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
            setSelectedEvent(response.data);
        } catch (error) {
            console.error('Error fetching event details:', error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/api/events/${eventId}`);
            fetchEvents();
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleDeleteSubEvent = async (eventId, subEventId) => {
        try {
            await axios.delete(`http://localhost:5000/api/events/${eventId}/subevents/${subEventId}`);
            const updatedEventResponse = await axios.get(`http://localhost:5000/api/events/${eventId}`);
            setSelectedEvent(updatedEventResponse.data);
            fetchEvents();
        } catch (error) {
            console.error('Error deleting sub-event:', error);
        }
    };

    const handleDeleteImage = async (eventId, subEventId, imageId) => {
        try {
            await axios.delete(`http://localhost:5000/api/events/${eventId}/subevents/${subEventId}/images/${imageId}`);
            const updatedEventResponse = await axios.get(`http://localhost:5000/api/events/${eventId}`);
            setSelectedEvent(updatedEventResponse.data);
            fetchEvents();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const handleEditEvent = async (eventId, updatedData) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedData.name);
            formData.append('description', updatedData.description);
            if (updatedData.coverImage) {
                formData.append('coverImage', updatedData.coverImage);
            }

            const response = await axios.put(`http://localhost:5000/api/events/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSelectedEvent(response.data);
            fetchEvents();
            setEditingEvent(null);
        } catch (error) {
            console.error('Error editing event:', error);
        }
    };

    const handleEditSubEvent = async (eventId, subEventId, updatedData) => {
        try {
            const formData = new FormData();
            formData.append('name', updatedData.name);
            formData.append('description', updatedData.description);
            if (updatedData.images) {
                updatedData.images.forEach((image, index) => {
                    formData.append(`images`, image);
                });
            }

            const response = await axios.put(`http://localhost:5000/api/events/${eventId}/subevents/${subEventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSelectedEvent(response.data);
            fetchEvents();
            setEditingSubEvent(null);
        } catch (error) {
            console.error('Error editing sub-event:', error);
        }
    };

    return (
        <div className="event-manager">
            <div className="event-list">
                <h2>Events</h2>
                {events.map(event => (
                    <div key={event._id} className="event-item" onClick={() => handleEventClick(event._id)}>
                        {event.name}
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div className="event-details">
                    {editingEvent ? (
                        <EditEventForm 
                            event={selectedEvent} 
                            onSave={handleEditEvent} 
                            onCancel={() => setEditingEvent(null)} 
                        />
                    ) : (
                        <>
                            <h2>{selectedEvent.name}</h2>
                            {selectedEvent.coverImage && selectedEvent.coverImage.data && (
                                <img 
                                    src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(selectedEvent.coverImage.data)))}`} 
                                    alt={selectedEvent.name} 
                                />
                            )}
                            <p>{selectedEvent.description}</p>
                            <button onClick={() => handleDeleteEvent(selectedEvent._id)}>Delete Event</button>
                            <button onClick={() => setEditingEvent(selectedEvent)}>Edit Event</button>
                        </>
                    )}

                    <h3>Sub Events</h3>
                    {selectedEvent.subEvents && selectedEvent.subEvents.length > 0 ? (
                        selectedEvent.subEvents.map(subEvent => (
                            <div key={subEvent._id} className="sub-event">
                                {editingSubEvent === subEvent._id ? (
                                    <EditSubEventForm 
                                        subEvent={subEvent} 
                                        onSave={(updatedData) => handleEditSubEvent(selectedEvent._id, subEvent._id, updatedData)} 
                                        onCancel={() => setEditingSubEvent(null)} 
                                    />
                                ) : (
                                    <>
                                        <h4>{subEvent.name}</h4>
                                        <p>{subEvent.description}</p>
                                        <button onClick={() => handleDeleteSubEvent(selectedEvent._id, subEvent._id)}>Delete Sub-Event</button>
                                        <button onClick={() => setEditingSubEvent(subEvent._id)}>Edit Sub-Event</button>

                                        <div className="sub-event-images">
                                            {subEvent.images && subEvent.images.length > 0 ? (
                                                subEvent.images.map((image, index) => (
                                                    <div key={index} className="sub-event-image">
                                                        {image && image.data && (
                                                            <img 
                                                                src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(image.data)))}`} 
                                                                alt={`${subEvent.name} image ${index + 1}`} 
                                                            />
                                                        )}
                                                        <button onClick={() => handleDeleteImage(selectedEvent._id, subEvent._id, image._id)}>Delete Image</button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No images found for this sub-event.</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No sub-events found for this event.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const EditEventForm = ({ event, onSave, onCancel }) => {
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [coverImage, setCoverImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(event._id, { name, description, coverImage });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="file" onChange={(e) => setCoverImage(e.target.files[0])} />
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

const EditSubEventForm = ({ subEvent, onSave, onCancel }) => {
    const [name, setName] = useState(subEvent.name);
    const [description, setDescription] = useState(subEvent.description);
    const [images, setImages] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description, images });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files))} />
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default EventManager;
