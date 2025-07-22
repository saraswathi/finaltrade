// src/components/TradeModal.js
import React, { useState, useEffect } from 'react';

const TradeModal = ({ open, onClose, config, playerWallet, executeTrade }) => {
  const [sellToken, setSellToken] = useState(config?.sellToken || 'FINAL');
  const [buyToken, setBuyToken] = useState(config?.buyToken || '3TOED');
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');

  // Token colors
  const tokenColors = {
    '3TOED': '#00FFF7',
    'MNRCH': '#FF3EC9',
    'FINAL': '#FFD700',
    'ETH': '#627EEA',
  };

  // Exchange rates (simplified)
  const exchangeRates = {
    'FINAL': { '3TOED': 10, 'MNRCH': 10, 'ETH': 0.1 },
    'ETH': { '3TOED': 100, 'MNRCH': 100, 'FINAL': 10 },
    '3TOED': { 'FINAL': 0.1, 'MNRCH': 1, 'ETH': 0.01 },
    'MNRCH': { 'FINAL': 0.1, '3TOED': 1, 'ETH': 0.01 }
  };

  // Update buy amount when sell amount changes
  useEffect(() => {
    if (sellAmount && parseFloat(sellAmount) > 0) {
      const rate = exchangeRates[sellToken]?.[buyToken] || 1;
      const calculated = (parseFloat(sellAmount) * rate).toFixed(2);
      setBuyAmount(calculated);
    } else {
      setBuyAmount('');
    }
  }, [sellAmount, sellToken, buyToken]);

  const handleSwap = () => {
    const temp = sellToken;
    setSellToken(buyToken);
    setBuyToken(temp);
    setSellAmount('');
    setBuyAmount('');
  };

  const handleMaxClick = () => {
    setSellAmount(playerWallet[sellToken].toString());
  };

  const handleTrade = () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) return;
    
    // Execute the trade through context
    executeTrade('sell', sellToken, parseFloat(sellAmount));
    executeTrade('buy', buyToken, parseFloat(buyAmount));
    
    onClose();
  };

  if (!open) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      background: 'linear-gradient(to bottom, #1a0033, #2d1b69)',
      border: '3px solid #FFD700',
      borderRadius: '20px',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '2px solid rgba(255, 215, 0, 0.3)'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#FFD700',
      textShadow: '0 0 20px #FFD700',
      fontFamily: 'Bungee, cursive'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#FFD700',
      fontSize: '24px',
      cursor: 'pointer'
    },
    content: {
      padding: '20px'
    },
    tokenSection: {
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '15px',
      padding: '15px',
      marginBottom: '15px',
      border: '2px solid rgba(255, 255, 255, 0.1)'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '14px'
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    tokenSelect: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '10px',
      padding: '10px 15px',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      minWidth: '100px'
    },
    amountInput: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      outline: 'none',
      textAlign: 'right',
      fontFamily: 'Orbitron, monospace'
    },
    maxBtn: {
      background: 'none',
      border: 'none',
      color: '#FFD700',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      padding: '5px 10px'
    },
    swapBtnContainer: {
      display: 'flex',
      justifyContent: 'center',
      margin: '-10px 0',
      position: 'relative',
      zIndex: 1
    },
    swapBtn: {
      background: 'rgba(255, 215, 0, 0.2)',
      border: '2px solid #FFD700',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    exchangeInfo: {
      textAlign: 'center',
      padding: '15px',
      background: 'rgba(255, 215, 0, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      marginBottom: '20px'
    },
    exchangeRate: {
      color: '#FFD700',
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'Orbitron, monospace'
    },
    tradeBtn: {
      width: '100%',
      background: '#00FF00',
      color: '#000',
      border: 'none',
      borderRadius: '15px',
      padding: '15px',
      fontSize: '20px',
      fontWeight: 'bold',
      fontFamily: 'Bungee, cursive',
      cursor: 'pointer',
      boxShadow: '0 0 30px #00FF00',
      transition: 'all 0.3s ease'
    },
    tradeBtnDisabled: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.3)',
      boxShadow: 'none',
      cursor: 'not-allowed'
    }
  };

  const isTradeValid = sellAmount && 
    parseFloat(sellAmount) > 0 && 
    parseFloat(sellAmount) <= playerWallet[sellToken];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>TRADE</div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.content}>
          {/* Sell Token Section */}
          <div style={styles.tokenSection}>
            <div style={styles.sectionHeader}>
              <span>You Pay</span>
              <span>Balance: {playerWallet[sellToken]}</span>
            </div>
            <div style={styles.inputRow}>
              <select 
                style={{...styles.tokenSelect, color: tokenColors[sellToken]}}
                value={sellToken}
                onChange={(e) => setSellToken(e.target.value)}
              >
                <option value="FINAL">$FINAL</option>
                <option value="ETH">ETH</option>
                <option value="3TOED">$3TOED</option>
                <option value="MNRCH">$MNRCH</option>
              </select>
              <input
                style={styles.amountInput}
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0.00"
              />
              <button style={styles.maxBtn} onClick={handleMaxClick}>
                MAX
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div style={styles.swapBtnContainer}>
            <button style={styles.swapBtn} onClick={handleSwap}>
              <span style={{ fontSize: '20px' }}>⇅</span>
            </button>
          </div>

          {/* Buy Token Section */}
          <div style={styles.tokenSection}>
            <div style={styles.sectionHeader}>
              <span>You Receive</span>
              <span>Balance: {playerWallet[buyToken]}</span>
            </div>
            <div style={styles.inputRow}>
              <select 
                style={{...styles.tokenSelect, color: tokenColors[buyToken]}}
                value={buyToken}
                onChange={(e) => setBuyToken(e.target.value)}
              >
                <option value="3TOED">$3TOED</option>
                <option value="MNRCH">$MNRCH</option>
                <option value="FINAL">$FINAL</option>
                <option value="ETH">ETH</option>
              </select>
              <input
                style={styles.amountInput}
                type="number"
                value={buyAmount}
                readOnly
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div style={styles.exchangeInfo}>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
              Exchange Rate
            </div>
            <div style={styles.exchangeRate}>
              1 {sellToken} = {exchangeRates[sellToken]?.[buyToken] || 1} {buyToken}
            </div>
          </div>

          {/* Trade Button */}
          <button 
            style={{
              ...styles.tradeBtn,
              ...(isTradeValid ? {} : styles.tradeBtnDisabled)
            }}
            onClick={handleTrade}
            disabled={!isTradeValid}
          >
            TRADE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;