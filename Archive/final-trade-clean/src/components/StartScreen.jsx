import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { GAME_CONFIG } from '../config/gameConfig';

export default function StartScreen() {
  const { player, actions } = useGame();
  const [selectedFighter, setSelectedFighter] = useState(null);
  
  const canPlay = player.wallet.FINAL >= GAME_CONFIG.rules.gateAmount;
  
  const handleStart = () => {
    if (canPlay && selectedFighter) {
      actions.startGame(selectedFighter);
    }
  };
  
  return (
    <div className="start-screen">
      <h1 className="game-title">FINAL TRADE</h1>
      <p className="game-subtitle">Market-Driven Species War</p>
      
      <div className="fighter-selection">
        <div 
          className={`fighter-card player1 ${selectedFighter === GAME_CONFIG.tokens.player1.id ? 'selected' : ''}`}
          onClick={() => setSelectedFighter(GAME_CONFIG.tokens.player1.id)}
        >
          <div className="fighter-preview">
            <img src="/assets/characters/sloth/idle.png" alt="3TOED" />
          </div>
          <div className="fighter-info">
            <h3>{GAME_CONFIG.tokens.player1.name}</h3>
            <p>{GAME_CONFIG.tokens.player1.symbol}</p>
            <p>Stable • Strategic • Resilient</p>
          </div>
        </div>
        
        <div 
          className={`fighter-card player2 ${selectedFighter === GAME_CONFIG.tokens.player2.id ? 'selected' : ''}`}
          onClick={() => setSelectedFighter(GAME_CONFIG.tokens.player2.id)}
        >
          <div className="fighter-preview">
            <img src="/assets/characters/monarch/idle.png" alt="MNRCH" />
          </div>
          <div className="fighter-info">
            <h3>{GAME_CONFIG.tokens.player2.name}</h3>
            <p>{GAME_CONFIG.tokens.player2.symbol}</p>
            <p>Volatile • High-Risk • Aggressive</p>
          </div>
        </div>
      </div>
      
      <div className="game-rules">
        <h3>How to Play</h3>
        <ul>
          <li>Choose your fighter and trade their token to influence the battle</li>
          <li>Buy to increase momentum, sell to weaken opponents</li>
          <li>Market movements determine attack strength every 30 seconds</li>
          <li>First to 0 HP loses!</li>
        </ul>
      </div>
      
      <button 
        className="start-button"
        onClick={handleStart}
        disabled={!selectedFighter || !canPlay}
      >
        {canPlay ? 'START BATTLE' : `Need ${GAME_CONFIG.rules.gateAmount} $FINAL to Play`}
      </button>
      
      {!canPlay && (
        <div className="gate-warning">
          <p>You have {player.wallet.FINAL} $FINAL</p>
          <p>Buy more $FINAL to enter the arena!</p>
        </div>
      )}
    </div>
  );
}