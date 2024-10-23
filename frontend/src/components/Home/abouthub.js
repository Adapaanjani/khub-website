import React from 'react';
import './abouthub.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="image-previeww">
        <div className="collaboration">
          <img src='/abouthub/iiith.png' alt="Collaboration 1" />
          <FontAwesomeIcon icon={faLink} className="link-icon" />
          <img src='/abouthub/kiet.png' alt="Collaboration 2" />
        </div>
      </div>
      <div className="text-content">
        <h2>ᗩᗷOᑌT Kᕼᑌᗷ</h2>
        <p>Khub, an initiative by KIET in collaboration with IIIT Hyderabad, was launched in 2023. Our hub serves as a vibrant platform where senior and junior developers collaborate on innovative projects under the guidance of IIITH interns as mentors. We foster a collaborative environment that bridges the gap between academic and industry, providing members with valuable hands-on experience and practical skills.</p>

        <h2>Oᑌᖇ ᗩIᗰ</h2>
        <p>At Khub, our main aim is to foster collaborative and competitive learning among teams. We focus on:
          <ol>
            <li>Engaging in various cutting-edge technology projects.</li>
            <li>Promoting professional growth and skill development.</li>
            <li>Building a strong network within the tech community.</li>
            <li>Creating an environment where innovation thrives through teamwork and mentorship.</li>
          </ol>
        </p>
        <h2>ᗯᕼY Kᕼᑌᗷ</h2>
        <p>Khub presents a unique opportunity for individuals eager to expand their technical prowess and delve into cutting-edge technologies. As a member of Khub, you'll engage in diverse projects and tasks meticulously designed to challenge and elevate your skill Set . In Khub, we believe in the power of hands-on experience. Through our projects, you'll not only apply theoretical knowledge but also gain practical insights.</p>
      </div>
    </div>
  );
};

export default AboutUs;
