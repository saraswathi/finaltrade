import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { GAME_CONFIG } from '../../config/gameConfig';

export default function TradingPanel() {
  const { player, actions, gameStatus } = useGame();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [showFinalPurchase, setShowFinalPurchase] = useState(false);
  
  const canTrade = gameStatus === 'playing';
  
  const handleTrade = (fighter, action) => {
    if (!canTrade) return;
    actions.executeTrade(fighter, action, selectedAmount);
  };
  
  const handleBuyFinal = (amount) => {
    actions.buyFinal(amount);
    setShowFinalPurchase(false);
  };
  
  return (
    <div className="trading-panel">
      {/* Wallet Display */}
      <div className="wallet-display">
        <div className="wallet-item">
          <span className="currency">ETH:</span>
          <span className="amount">{player.wallet.ETH.toFixed(2)}</span>
        </div>
        <div className="wallet-item final">
          <span className="currency">$FINAL:</span>
          <span className="amount">{player.wallet.FINAL}</span>
          {player.finalBuffActive > 0 && (
            <span className="buff-indicator">
              {GAME_CONFIG.finalToken.buffs[player.finalBuffActive - 1].name}
            </span>
          )}
        </div>
        <button 
          className="buy-final-btn"
          onClick={() => setShowFinalPurchase(!showFinalPurchase)}
        >
          Buy $FINAL
        </button>
      </div>
      
      {/* $FINAL Purchase Modal */}
      {showFinalPurchase && (
        <div className="final-purchase-modal">
          <h3>Buy $FINAL Tokens</h3>
          <p>Unlock buffs and regenerate HP!</p>
          <div className="purchase-options">
            <button onClick={() => handleBuyFinal(50)}>
              50 $FINAL (0.5 ETH)
            </button>
            <button onClick={() => handleBuyFinal(100)}>
              100 $FINAL (1 ETH)
            </button>
            <button onClick={() => handleBuyFinal(150)}>
              150 $FINAL (1.5 ETH)
            </button>
          </div>
          <button className="close-btn" onClick={() => setShowFinalPurchase(false)}>
            Cancel
          </button>
        </div>
      )}
      
      {/* Trade Amount Selector */}
      <div className="trade-controls">
        <label>Trade Amount:</label>
        <div className="amount-selector">
          <button onClick={() => setSelectedAmount(100)}>100</button>
          <button onClick={() => setSelectedAmount(500)}>500</button>
          <button onClick={() => setSelectedAmount(1000)}>1000</button>
          <input 
            type="number" 
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 0)}
            min="1"
            max="10000"
          />
        </div>
      </div>
      
      {/* Trading Buttons */}
      <div className="trading-buttons">
        <div className="token-trading">
          <h4 style={{ color: GAME_CONFIG.tokens.player1.color }}>
            {GAME_CONFIG.tokens.player1.symbol}
          </h4>
          <div className="token-balance">
            Balance: {player.wallet[GAME_CONFIG.tokens.player1.id]}
          </div>
          <div className="trade-actions">
            <button 
              className="buy-btn"
              onClick={() => handleTrade(GAME_CONFIG.tokens.player1.id, 'buy')}
              disabled={!canTrade || player.wallet.ETH < selectedAmount * 0.001}
            >
              BUY
            </button>
            <button 
              className="sell-btn"
              onClick={() => handleTrade(GAME_CONFIG.tokens.player1.id, 'sell')}
              disabled={!canTrade || player.wallet[GAME_CONFIG.tokens.player1.id] < selectedAmount}
            >
              SELL
            </button>
          </div>
        </div>
        
        <div className="token-trading">
          <h4 style={{ color: GAME_CONFIG.tokens.player2.color }}>
            {GAME_CONFIG.tokens.player2.symbol}
          </h4>
          <div className="token-balance">
            Balance: {player.wallet[GAME_CONFIG.tokens.player2.id]}
          </div>
          <div className="trade-actions">
            <button 
              className="buy-btn"
              onClick={() => handleTrade(GAME_CONFIG.tokens.player2.id, 'buy')}
              disabled={!canTrade || player.wallet.ETH < selectedAmount * 0.001}
            >
              BUY
            </button>
            <button 
              className="sell-btn"
              onClick={() => handleTrade(GAME_CONFIG.tokens.player2.id, 'sell')}
              disabled={!canTrade || player.wallet[GAME_CONFIG.tokens.player2.id] < selectedAmount}
            >
              SELL
            </button>
          </div>
        </div>
      </div>
      
      {/* Trade Info */}
      <div className="trade-info">
        <p>Buy to increase momentum • Sell to decrease opponent's power</p>
        <p>Larger trades = bigger impact!</p>
      </div>
    </div>
  );
}