import React, { useEffect, useState, useCallback } from 'react';
import { useGame } from '../../contexts/GameContext';
import { GAME_CONFIG } from '../../config/gameConfig';
import HealthBar from './HealthBar';
import MomentumBar from './MomentumBar';
import Timer from './Timer';
import TradingPanel from '../Trading/TradingPanel';
import Commentary from './Commentary';
import CharacterDisplay from './CharacterDisplay';

export default function BattleArena() {
  const { 
    fighters, 
    currentRound, 
    gameStatus, 
    timeRemaining,
    actions 
  } = useGame();
  
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  
  // Handle round transitions
  useEffect(() => {
    if (gameStatus === 'roundEnd') {
      setShowRoundTransition(true);
      setTimeout(() => {
        setShowRoundTransition(false);
        actions.updateTimer(GAME_CONFIG.rules.roundDuration);
      }, GAME_CONFIG.animations.roundTransition);
    }
  }, [gameStatus, actions]);
  
  // Round timer countdown
  useEffect(() => {
    if (gameStatus !== 'playing' || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      if (timeRemaining <= 1) {
        actions.updateTimer(0);
        actions.endRound();
      } else {
        actions.updateTimer(timeRemaining - 1);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, gameStatus, actions]);
  
  // Simulate market data updates (in real version, this would come from API)
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const marketInterval = setInterval(() => {
      // Simulate price changes
      const p1Change = (Math.random() - 0.5) * 4; // -2% to +2%
      const p2Change = (Math.random() - 0.5) * 4;
      
      actions.updateMarketData(GAME_CONFIG.tokens.player1.id, p1Change);
      actions.updateMarketData(GAME_CONFIG.tokens.player2.id, p2Change);
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(marketInterval);
  }, [gameStatus, actions]);
  
  return (
    <div className="battle-arena">
      {/* Top HUD */}
      <div className="battle-hud">
        <div className="hud-left">
          <HealthBar 
            fighter={GAME_CONFIG.tokens.player1.id}
            hp={fighters[GAME_CONFIG.tokens.player1.id].hp}
            color={GAME_CONFIG.tokens.player1.color}
          />
          <div className="fighter-name">{GAME_CONFIG.tokens.player1.symbol}</div>
        </div>
        
        <div className="hud-center">
          <Timer timeRemaining={timeRemaining} />
          <div className="round-indicator">Round {currentRound}/{GAME_CONFIG.rules.totalRounds}</div>
        </div>
        
        <div className="hud-right">
          <HealthBar 
            fighter={GAME_CONFIG.tokens.player2.id}
            hp={fighters[GAME_CONFIG.tokens.player2.id].hp}
            color={GAME_CONFIG.tokens.player2.color}
          />
          <div className="fighter-name">{GAME_CONFIG.tokens.player2.symbol}</div>
        </div>
      </div>
      
      {/* Main Arena */}
      <div className="arena-display">
        <div className="fighter-section left">
          <CharacterDisplay 
            fighter={GAME_CONFIG.tokens.player1.id}
            character={GAME_CONFIG.tokens.player1.character}
            currentMove={fighters[GAME_CONFIG.tokens.player1.id].currentMove}
            isFlipped={false}
          />
          <MomentumBar 
            momentum={fighters[GAME_CONFIG.tokens.player1.id].momentum}
            color={GAME_CONFIG.tokens.player1.color}
          />
        </div>
        
        <div className="arena-center">
          {showRoundTransition && (
            <div className="round-transition">
              <h2>FIGHT!</h2>
            </div>
          )}
        </div>
        
        <div className="fighter-section right">
          <CharacterDisplay 
            fighter={GAME_CONFIG.tokens.player2.id}
            character={GAME_CONFIG.tokens.player2.character}
            currentMove={fighters[GAME_CONFIG.tokens.player2.id].currentMove}
            isFlipped={true}
          />
          <MomentumBar 
            momentum={fighters[GAME_CONFIG.tokens.player2.id].momentum}
            color={GAME_CONFIG.tokens.player2.color}
          />
        </div>
      </div>
      
      {/* Market Info Bar */}
      <div className="market-info-bar">
        <div className="market-stat">
          <span className="label">3TOED:</span>
          <span className={`value ${fighters[GAME_CONFIG.tokens.player1.id].marketTier >= 3 ? 'positive' : 'negative'}`}>
            Tier {fighters[GAME_CONFIG.tokens.player1.id].marketTier}
          </span>
        </div>
        <div className="market-stat">
          <span className="label">MNRCH:</span>
          <span className={`value ${fighters[GAME_CONFIG.tokens.player2.id].marketTier >= 3 ? 'positive' : 'negative'}`}>
            Tier {fighters[GAME_CONFIG.tokens.player2.id].marketTier}
          </span>
        </div>
      </div>
      
      {/* Trading Panel */}
      <TradingPanel />
      
      {/* Commentary */}
      <Commentary />
    </div>
  );
}