import React from 'react';
import { useGame } from '../../contexts/GameContext';

export default function Commentary() {
  const { commentary } = useGame();
  
  // Show last 5 messages
  const recentCommentary = commentary.slice(-5).reverse();
  
  return (
    <div className="commentary">
      {recentCommentary.map((item, index) => (
        <div key={index} className="commentary-item">
          <span className="commentary-time">
            {new Date(item.timestamp).toLocaleTimeString()}
          </span>
          <span className="commentary-text">{item.text}</span>
        </div>
      ))}
    </div>
  );
}