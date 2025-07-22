import React, { useState, useEffect, useContext, useRef } from 'react';
import { GameContext } from '../contexts/GameContext';
import TradeModal from '../components/battle/TradeModal';
import './Battle.css';

const Battle = () => {
  const { 
    gameState,
    currentRound,
    roundTimer,
    fighterHP,
    momentum,
    currentMoves,
    battleLog,
    marketCommentary,
    executeTrade,
    playerWallet,
    tokenConfig,
    startGame,
    marketData
  } = useContext(GameContext);

  const [showFightOverlay, setShowFightOverlay] = useState(false);
  const [currentImage, setCurrentImage] = useState('idle');
  const [buyRatio, setBuyRatio] = useState(50);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeConfig, setTradeConfig] = useState(null);
  const [localCommentary, setLocalCommentary] = useState('');
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  const [lastHit, setLastHit] = useState(null);
  const [fightLogOpen, setFightLogOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('fightLog');
  const [fightLogEntries, setFightLogEntries] = useState([]);
  const [attackStrength, setAttackStrength] = useState({ '3TOED': 3, 'MNRCH': 3 });

  const battleArenaRef = useRef(null);

  // Start game when component mounts
  useEffect(() => {
    if (gameState === 'idle') {
      startGame();
    }
  }, [gameState, startGame]);

  // Calculate attack strength based on market data
  useEffect(() => {
    if (marketData) {
      // Map price change to tier (1-5)
      const calculateTier = (priceChange) => {
        if (priceChange >= 2) return 5;
        if (priceChange >= 0.5) return 4;
        if (priceChange >= -0.49) return 3;
        if (priceChange >= -1) return 2;
        return 1;
      };

      setAttackStrength({
        '3TOED': calculateTier(marketData.PEPE?.change || 0),
        'MNRCH': calculateTier(marketData.DOGE?.change || 0)
      });
    }
  }, [marketData]);

  // Timer effect for FIGHT! overlay
  useEffect(() => {
    if (roundTimer === 3) {
      setShowFightOverlay(true);
      setTimeout(() => setShowFightOverlay(false), 1000);
    }
  }, [roundTimer]);

  // Update fight log with battle events
  useEffect(() => {
    if (battleLog && battleLog.length > 0) {
      const latestEntry = battleLog[battleLog.length - 1];
      addToFightLog(latestEntry.message, latestEntry.type);
    }
  }, [battleLog]);

  // Update image and visual effects based on current moves
  useEffect(() => {
    if (!currentMoves['3TOED'] && !currentMoves['MNRCH']) {
      setCurrentImage('idle');
      return;
    }

    const slothMove = currentMoves['3TOED'];
    const monarchMove = currentMoves['MNRCH'];
    
    if (slothMove && slothMove.tier) {
      const damage = slothMove.tier;
      setCurrentImage(`sloth_attack_${damage}`);
      
      // Add damage number
      const newDamageNumber = {
        id: Date.now(),
        value: damage,
        x: '60%',
        y: '40%'
      };
      setDamageNumbers(prev => [...prev, newDamageNumber]);
      
      // Screen shake on high damage
      if (damage >= 4) {
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 500);
      }
      
      setLastHit('MNRCH');
      
      // Clear damage number after animation
      setTimeout(() => {
        setDamageNumbers(prev => prev.filter(d => d.id !== newDamageNumber.id));
      }, 1000);
      
      setTimeout(() => {
        setCurrentImage('idle');
        setLastHit(null);
      }, 3000);
    } else if (monarchMove && monarchMove.tier) {
      const damage = monarchMove.tier;
      setCurrentImage(`monarch_attack_${damage}`);
      
      // Add damage number
      const newDamageNumber = {
        id: Date.now(),
        value: damage,
        x: '40%',
        y: '40%'
      };
      setDamageNumbers(prev => [...prev, newDamageNumber]);
      
      // Screen shake on high damage
      if (damage >= 4) {
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 500);
      }
      
      setLastHit('3TOED');
      
      // Clear damage number after animation
      setTimeout(() => {
        setDamageNumbers(prev => prev.filter(d => d.id !== newDamageNumber.id));
      }, 1000);
      
      setTimeout(() => {
        setCurrentImage('idle');
        setLastHit(null);
      }, 3000);
    }
  }, [currentMoves]);

  // Show market commentary
  useEffect(() => {
    if (marketCommentary) {
      setLocalCommentary(marketCommentary);
      addToFightLog(marketCommentary, 'mossmouth');
      const timer = setTimeout(() => setLocalCommentary(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [marketCommentary]);

  const addToFightLog = (message, type = 'normal') => {
    const entry = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setFightLogEntries(prev => [...prev, entry].slice(-50)); // Keep last 50 entries
  };

  const handleTrade = (action, token) => {
    const amount = action === 'buy' ? 10 : 5;
    executeTrade(action, token, amount);
    
    // Update buy ratio visualization
    if (token === '3TOED') {
      setBuyRatio(prev => action === 'buy' ? Math.max(0, prev - 5) : Math.min(100, prev + 5));
    } else {
      setBuyRatio(prev => action === 'buy' ? Math.min(100, prev + 5) : Math.max(0, prev - 5));
    }

    // Add to fight log
    addToFightLog(
      `You ${action === 'buy' ? 'bought' : 'sold'} ${amount} ${token}!`,
      'trade'
    );

    // Visual feedback for trades
    const tradeEffect = document.createElement('div');
    tradeEffect.className = `trade-effect ${action} ${token.toLowerCase()}`;
    tradeEffect.textContent = action === 'buy' ? '+' : '-';
    tradeEffect.style.left = token === '3TOED' ? '25%' : '75%';
    tradeEffect.style.bottom = '200px';
    battleArenaRef.current?.appendChild(tradeEffect);
    setTimeout(() => tradeEffect.remove(), 1000);
  };

  const openTradeModal = () => {
    setTradeConfig({
      sellToken: 'ETH',
      buyToken: 'FINAL'
    });
    setShowTradeModal(true);
  };

  const getCharacterImage = () => {
    const basePath = `${process.env.PUBLIC_URL}/assets/images/characters`;
    
    if (currentImage === 'idle') {
      return `${basePath}/idle/fighters_idle.png`;
    } else if (currentImage.includes('attack')) {
      return `${basePath}/attacks/${currentImage}.png`;
    } else if (currentImage.includes('momentum')) {
      return `${basePath}/momentum/${currentImage}.png`;
    }
    
    return `${basePath}/idle/fighters_idle.png`;
  };

  // Check for game end
  useEffect(() => {
    if (fighterHP['3TOED'] <= 0 || fighterHP['MNRCH'] <= 0) {
      const winner = fighterHP['3TOED'] > 0 ? '3TOED' : 'MNRCH';
      setLocalCommentary(`GAME OVER! ${winner} WINS!`);
      addToFightLog(`GAME OVER! ${winner} WINS!`, 'end');
    }
  }, [fighterHP]);

  return (
    <div className={`battle-container ${screenShake ? 'screen-shake' : ''}`} ref={battleArenaRef}>
      {/* Fight Log Panel */}
      <div className={`fight-log-panel ${fightLogOpen ? 'open' : 'closed'}`}>
        <div className="panel-tabs">
          <button 
            className={`tab ${activeTab === 'fightLog' ? 'active' : ''}`}
            onClick={() => setActiveTab('fightLog')}
          >
            Fight Log
          </button>
          <button 
            className={`tab ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            Quests <span className="quest-count">4</span>
          </button>
          <button 
            className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            Rules
          </button>
        </div>

        <div className="panel-content">
          {activeTab === 'fightLog' && (
            <div className="fight-log-content">
              {fightLogEntries.map(entry => (
                <div key={entry.id} className={`log-entry ${entry.type}`}>
                  {entry.type === 'mossmouth' && (
                    <img 
                      src={`${process.env.PUBLIC_URL}/assets/images/mossmouth-icon.png`} 
                      alt="M" 
                      className="mossmouth-icon"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="mossmouth-icon-fallback">M</div>' + e.target.parentElement.innerHTML;
                      }}
                    />
                  )}
                  <div className="log-message">
                    {entry.type === 'mossmouth' && (
                      <div className="log-header">Mossmouth</div>
                    )}
                    <div className="log-text">{entry.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'quests' && (
            <div className="quests-content">
              <p>Coming soon...</p>
            </div>
          )}
          {activeTab === 'rules' && (
            <div className="rules-content">
              <p>Every 30 seconds, market data determines attack strength!</p>
              <p>Buy and sell to build momentum and help your fighter!</p>
            </div>
          )}
        </div>

        <button 
          className="panel-toggle"
          onClick={() => setFightLogOpen(!fightLogOpen)}
        >
          {fightLogOpen ? '−' : '+'}
        </button>
      </div>

      {/* Top Section - HP Bars and Timer */}
      <div className="battle-top-section">
        <div className="hp-section">
          <div className="hp-label">3TOED</div>
          <div className="hp-bar-container">
            <div 
              className={`hp-bar hp-bar-3toed ${lastHit === '3TOED' ? 'hp-flash' : ''}`}
              style={{ width: `${fighterHP['3TOED']}%` }}
            />
          </div>
          <div className="hp-value">{fighterHP['3TOED']}/100</div>
        </div>

        <div className="round-timer">
          <div className="timer-label">NEXT MOVE IN</div>
          <div className={`timer-value ${roundTimer <= 5 ? 'timer-urgent' : ''}`}>
            {Math.ceil(roundTimer)}
          </div>
          <div className="round-label">Round {currentRound}</div>
        </div>

        <div className="hp-section">
          <div className="hp-label">MNRCH</div>
          <div className="hp-bar-container">
            <div 
              className={`hp-bar hp-bar-mnrch ${lastHit === 'MNRCH' ? 'hp-flash' : ''}`}
              style={{ width: `${fighterHP['MNRCH']}%` }}
            />
          </div>
          <div className="hp-value">{fighterHP['MNRCH']}/100</div>
        </div>
      </div>

      {/* Main Battle Arena */}
      <div className="battle-arena">
        {/* Character Display */}
        <div className="characters-container">
          <img 
            src={getCharacterImage()} 
            alt="Battle"
            className={lastHit ? `character-hit-${lastHit.toLowerCase()}` : ''}
            onError={(e) => {
              console.log('Failed to load:', e.target.src);
            }}
          />
          
          {/* Damage Numbers */}
          {damageNumbers.map(dmg => (
            <div 
              key={dmg.id}
              className="damage-number"
              style={{ left: dmg.x, top: dmg.y }}
            >
              -{dmg.value}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Trading Section */}
      <div className="trading-section">
        {/* 3TOED Trading Box */}
        <div className={`token-box token-3toed ${momentum['3TOED'] > 0 ? 'momentum-glow' : ''}`}>
          <div className="token-header">
            <div className="token-amount">{playerWallet['3TOED'] || 0}</div>
            <div className="token-name">$3TOED</div>
          </div>
          
          <div className="momentum-bar">
            <div className="momentum-label">Momentum</div>
            <div className="momentum-segments">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`segment ${i < momentum['3TOED'] ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          
          <div className="trade-buttons">
            <button 
              className="trade-btn buy-btn"
              onClick={() => handleTrade('buy', '3TOED')}
            >
              BUY
            </button>
            <button 
              className="trade-btn sell-btn"
              onClick={() => handleTrade('sell', '3TOED')}
              disabled={!playerWallet['3TOED'] || playerWallet['3TOED'] <= 0}
            >
              SELL
            </button>
          </div>
        </div>

        {/* Central Reload Button with Ratio Bar */}
        <div className="reload-button-container">
          {/* Ratio Bar above Reload */}
          <div className="ratio-bar-container">
            <div className="ratio-bar">
              <div 
                className="ratio-fill ratio-3toed"
                style={{ width: `${100 - buyRatio}%` }}
              />
              <div 
                className="ratio-fill ratio-mnrch"
                style={{ width: `${buyRatio}%` }}
              />
            </div>
            <div className="ratio-text">
              3TOED: {100 - buyRatio}% | MNRCH: {buyRatio}%
            </div>
          </div>
          
          <button 
            className="main-trade-btn pulse"
            onClick={openTradeModal}
          >
            RELOAD
          </button>
        </div>

        {/* MNRCH Trading Box */}
        <div className={`token-box token-mnrch ${momentum['MNRCH'] > 0 ? 'momentum-glow' : ''}`}>
          <div className="token-header">
            <div className="token-amount">{playerWallet['MNRCH'] || 0}</div>
            <div className="token-name">$MNRCH</div>
          </div>
          
          <div className="momentum-bar">
            <div className="momentum-label">Momentum</div>
            <div className="momentum-segments">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`segment ${i < momentum['MNRCH'] ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          
          <div className="trade-buttons">
            <button 
              className="trade-btn buy-btn"
              onClick={() => handleTrade('buy', 'MNRCH')}
            >
              BUY
            </button>
            <button 
              className="trade-btn sell-btn"
              onClick={() => handleTrade('sell', 'MNRCH')}
              disabled={!playerWallet['MNRCH'] || playerWallet['MNRCH'] <= 0}
            >
              SELL
            </button>
          </div>
        </div>
      </div>

      {/* FIGHT! Overlay */}
      {showFightOverlay && (
        <div className="fight-overlay">
          <div className="fight-text">FIGHT!</div>
        </div>
      )}

      {/* Trade Modal */}
      {showTradeModal && (
        <TradeModal
          open={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          config={tradeConfig}
          playerWallet={playerWallet}
          executeTrade={executeTrade}
        />
      )}
    </div>
  );
};

export default Battle;