import React from 'react';
import { useGame } from '../contexts/GameContext';
import { GAME_CONFIG } from '../config/gameConfig';

export default function EndScreen() {
  const { winner, fighters, currentRound, actions } = useGame();
  
  const winnerConfig = winner === GAME_CONFIG.tokens.player1.id 
    ? GAME_CONFIG.tokens.player1 
    : GAME_CONFIG.tokens.player2;
    
  const loserConfig = winner === GAME_CONFIG.tokens.player1.id 
    ? GAME_CONFIG.tokens.player2 
    : GAME_CONFIG.tokens.player1;
  
  return (
    <div className="end-screen">
      <h1 className="victory-text" style={{ color: winnerConfig.color }}>
        VICTORY!
      </h1>
      <div className="winner-display">
        {winnerConfig.symbol} WINS!
      </div>
      
      <div className="battle-stats">
        <h3>Battle Summary</h3>
        <div className="stat-row">
          <span>Rounds Played:</span>
          <span>{currentRound}</span>
        </div>
        <div className="stat-row">
          <span>{winnerConfig.symbol} Final HP:</span>
          <span>{fighters[winner].hp}</span>
        </div>
        <div className="stat-row">
          <span>{winnerConfig.symbol} Damage Dealt:</span>
          <span>{fighters[winner].totalDamageDealt}</span>
        </div>
        <div className="stat-row">
          <span>{loserConfig.symbol} Final HP:</span>
          <span>{fighters[loserConfig.id].hp}</span>
        </div>
      </div>
      
      <button className="play-again-btn" onClick={actions.resetGame}>
        PLAY AGAIN
      </button>
    </div>
  );
}