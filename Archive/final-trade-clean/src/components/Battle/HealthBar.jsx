import React from 'react';

export default function HealthBar({ hp, color }) {
  const percentage = (hp / 100) * 100;
  const healthStatus = hp > 70 ? 'high' : hp > 30 ? 'medium' : 'low';
  
  return (
    <div className="health-bar-container">
      <div className="health-bar">
        <div 
          className={`health-fill ${healthStatus}`}
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`
          }}
        />
      </div>
      <div className="health-text">{hp}/100 HP</div>
    </div>
  );
}