import React from 'react';

export default function CharacterDisplay({ character, currentMove, isFlipped }) {
  const imagePath = currentMove 
    ? `/assets/characters/${character}/${currentMove}.png`
    : `/assets/characters/${character}/idle.png`;
    
  return (
    <div className={`character-display ${isFlipped ? 'flipped' : ''}`}>
      <img 
        src={imagePath} 
        alt={character}
        onError={(e) => {
          e.target.src = `/assets/characters/${character}/idle.png`;
        }}
      />
    </div>
  );
}