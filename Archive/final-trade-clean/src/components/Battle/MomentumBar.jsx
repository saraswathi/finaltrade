import React from 'react';

export default function MomentumBar({ momentum, color }) {
  const segments = [];
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue; // Skip center
    
    const isActive = momentum > 0 ? i > 0 && i <= momentum : i < 0 && i >= momentum;
    const isNegative = i < 0 && isActive;
    
    segments.push(
      <div 
        key={i}
        className={`momentum-segment ${isActive ? 'active' : ''} ${isNegative ? 'negative' : ''}`}
        style={isActive && !isNegative ? { backgroundColor: color } : {}}
      />
    );
  }
  
  return (
    <div className="momentum-bar">
      {segments}
    </div>
  );
}