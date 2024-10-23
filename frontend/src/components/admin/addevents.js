import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AddEvent = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [name, setName] = useState('');
  const [mainPic, setMainPic] = useState(null);
  const [subEvents, setSubEvents] = useState([{ name: '', description: '', images: [] }]);

  const handleAddSubEvent = () => {
    setSubEvents([...subEvents, { name: '', description: '', images: [] }]);
  };

  const handleSubEventChange = (index, key, value) => {
    const newSubEvents = [...subEvents];
    newSubEvents[index][key] = value;
    setSubEvents(newSubEvents);
  };

  const handleSubEventImageChange = (index, files) => {
    const newSubEvents = [...subEvents];
    newSubEvents[index].images = files;
    setSubEvents(newSubEvents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('mainPic', mainPic);

    const subEventsData = subEvents.map(subEvent => ({
      name: subEvent.name,
      description: subEvent.description,
      imageCount: subEvent.images.length
    }));
    formData.append('subEvents', JSON.stringify(subEventsData));

    subEvents.forEach((subEvent, index) => {
      subEvent.images.forEach((image, i) => {
        formData.append(`subEventImages[${index}]`, image); // Adjusted key for images
      });
    });

    try {
      const response = await axios.post('http://localhost:5000/api/events/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>.</h1>
      <button type="button" onClick={() => navigate(-1)} className="button">Back</button> {/* Back button */}
      <div>
        <label>Event Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Main Picture:</label>
        <input type="file" onChange={(e) => setMainPic(e.target.files[0])} />
      </div>
      {subEvents.map((subEvent, index) => (
        <div key={index}>
          <div>
            <label>Sub-event Name:</label>
            <input
              type="text"
              value={subEvent.name}
              onChange={(e) => handleSubEventChange(index, 'name', e.target.value)}
            />
          </div>
          <div>
            <label>Sub-event Description:</label>
            <input
              type="text"
              value={subEvent.description}
              onChange={(e) => handleSubEventChange(index, 'description', e.target.value)}
            />
          </div>
          <div>
            <label>Sub-event Images:</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleSubEventImageChange(index, Array.from(e.target.files))}
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddSubEvent}>Add Sub-event</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddEvent;
