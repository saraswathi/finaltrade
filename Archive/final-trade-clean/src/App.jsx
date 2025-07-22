import React from 'react';
import { GameProvider } from './contexts/GameContext';
import GameScreen from './components/GameScreen';
import './styles/globals.css';

function App() {
  return (
    <GameProvider>
      <div className="app">
        <GameScreen />
      </div>
    </GameProvider>
  );
}

export default App;