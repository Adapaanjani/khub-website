import React from 'react';
import './support.css';

const Cards = () => {
  // Image sources, names, and descriptions
  const cards = [
    { src: '/cards/vishwam.png', name: 'Pothula Venkata Viswam', description: 'Chairman,KIET Group-korangi.' },
    { src: '/cards/ramesh.png', name: 'Ramesh Loganathan', description: 'Professor of Practice,Co-Innovation,IIITH.' },
    { src: '/cards/arjun.png', name: 'Arjun Rajasekar', description: 'Experienced, Proactive Researcher at RCTS,IIITH.' },
    { src: '/cards/revathi.png', name: 'Revathi Duba', description: 'Principal,KIET-Korangi.' },
    { src: '/cards/rk.png', name: 'Rama Krishna', description: 'Principal,KIET W-Korangi.' },
    { src: '/cards/akka.png', name: 'Durga Bhavani Gunnam', description: 'Research Translation Engineer at RCTS,IIITH.' }
  ];

  return (
    <div className='support'>
      <h1 className="cards-heading">ADVISORS</h1>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.src} alt={card.name} className="card-image" />
            <div className="card-content">
              <h3>{card.name}</h3>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
