import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { GAME_CONFIG } from '../config/gameConfig';
import BattleArena from './Battle/BattleArena';
import StartScreen from './StartScreen';
import EndScreen from './EndScreen';

export default function GameScreen() {
  const { gameStatus } = useGame();
  
  switch (gameStatus) {
    case 'idle':
      return <StartScreen />;
    case 'playing':
    case 'roundEnd':
      return <BattleArena />;
    case 'ended':
      return <EndScreen />;
    default:
      return <StartScreen />;
  }
}