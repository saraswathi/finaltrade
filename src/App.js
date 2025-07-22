import React, { useState, useEffect } from 'react';
import './App.css';
import Battle from './pages/Battle';
import { GameProvider } from './contexts/GameContext';
import { preloadBattleImages } from './utils/imagePreloader';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerTokens, setPlayerTokens] = useState({
    FINAL: 50,
    ETH: 5
  });

  // Preload battle images when app starts
  useEffect(() => {
    preloadBattleImages();
    console.log('Preloading battle images...');
  }, []);

  const startGame = () => {
    if (playerTokens.FINAL >= 50) {
      setGameStarted(true);
    } else {
      alert('You need 50 $FINAL to play!');
    }
  };

  const buyFinal = () => {
    if (playerTokens.ETH >= 1) {
      setPlayerTokens({
        ...playerTokens,
        ETH: playerTokens.ETH - 1,
        FINAL: playerTokens.FINAL + 10
      });
    } else {
      alert('Not enough ETH!');
    }
  };

  return (
    <GameProvider>
      <div className="App">
        {!gameStarted ? (
          // Start Screen
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #1a0033, #2d1b69)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            padding: '20px'
          }}>
            <h1 style={{
              fontSize: 'clamp(48px, 10vw, 72px)',
              color: '#FFD700',
              textShadow: '0 0 30px #FFD700',
              marginBottom: '20px',
              fontFamily: 'monospace',
              textAlign: 'center'
            }}>
              FINAL TRADE
            </h1>
            
            <h2 style={{ color: '#00FFF7', marginBottom: '10px' }}>3TOED</h2>
            <h2 style={{ color: '#FFD700', marginBottom: '10px' }}>VS</h2>
            <h2 style={{ color: '#FF3EC9', marginBottom: '40px' }}>MNRCH</h2>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '30px',
              borderRadius: '10px',
              border: '2px solid #FFD700',
              marginBottom: '30px',
              maxWidth: '90%',
              width: '400px'
            }}>
              <h3 style={{ color: '#FFD700', marginBottom: '20px' }}>
                Entry Fee: 50 $FINAL
              </h3>
              <p>Your Balance: {playerTokens.FINAL} $FINAL | {playerTokens.ETH} ETH</p>
              
              {playerTokens.FINAL < 50 && (
                <button 
                  onClick={buyFinal}
                  style={{
                    marginTop: '20px',
                    padding: '10px 30px',
                    fontSize: '18px',
                    background: '#FFD700',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Buy 10 $FINAL (1 ETH)
                </button>
              )}
            </div>
            
            <button 
              onClick={startGame}
              disabled={playerTokens.FINAL < 50}
              style={{
                padding: '20px 60px',
                fontSize: 'clamp(24px, 5vw, 32px)',
                background: playerTokens.FINAL >= 50 ? '#00FF00' : '#666',
                color: playerTokens.FINAL >= 50 ? '#000' : '#333',
                border: 'none',
                borderRadius: '10px',
                cursor: playerTokens.FINAL >= 50 ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                boxShadow: playerTokens.FINAL >= 50 ? '0 0 30px #00FF00' : 'none'
              }}
            >
              PLAY
            </button>
          </div>
        ) : (
          // Game Screen - Pass initial tokens to Battle
          <Battle initialTokens={playerTokens} />
        )}
      </div>
    </GameProvider>
  );
}

export default App;