import React, { useState, useEffect } from 'react';

const goldenDogBones = [
  {
    name: 'Bone A',
    picture: 'path-to-picture-A', // Update with the actual path
    description: 'This is Bone A description.',
    promo: '10% off your next purchase!'
  },
  {
    name: 'Bone B',
    picture: 'path-to-picture-B', // Update with the actual path
    description: 'This is Bone B description.',
    promo: '20% off for premium members!'
  },
  {
    name: 'Bone C',
    picture: 'path-to-picture-C', // Update with the actual path
    description: 'This is Bone C description.',
    promo: 'Free shipping on your next order!'
  },
  // Add more bones as needed
];

const GoldenDogBone = ({ goldenBones }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedBones, setDisplayedBones] = useState([]);

  useEffect(() => {
    const newDisplayedBones = [];
    for (let i = 0; i < goldenBones; i++) {
      const randomIndex = Math.floor(Math.random() * goldenDogBones.length);
      newDisplayedBones.push(goldenDogBones[randomIndex]);
    }
    setDisplayedBones(newDisplayedBones);
  }, [goldenBones]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="golden-dogbone-container">
      <div className="dropdown-icon" onClick={toggleExpand}>
        {isExpanded ? '▲' : '▼'} Golden Dog Bone Collections
      </div>
      {isExpanded && (
        <div className="golden-dogbone-details-container">
          {displayedBones.map((bone, index) => (
            <div className="golden-dogbone-details" key={index}>
              <h3>{bone.name}</h3>
              <img src={bone.picture} alt={bone.name} />
              <p>{bone.description}</p>
              <p><strong>Promo: </strong>{bone.promo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoldenDogBone;
