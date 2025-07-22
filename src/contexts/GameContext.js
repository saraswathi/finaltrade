import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import TOKEN_CONFIG from '../config/tokenConfig';
import PLAYER_PROFILES, { DEFAULT_PROFILE, calculateMomentumTier, getTradeImpact } from '../config/playerProfiles';
import CoinGeckoService from '../services/CoinGeckoService';
import GameMechanicsService from '../services/GameMechanicsService';
import marketScenarios from '../data/marketScenarios.json';
import marketPopups from '../data/final_trade_popups.json';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Game state
  const [gameState, setGameState] = useState('idle'); // idle, playing, ended
  const [currentRound, setCurrentRound] = useState(0);
  const [roundTimer, setRoundTimer] = useState(TOKEN_CONFIG.game.countdownStart);
  const [marketMode, setMarketMode] = useState('launch'); // launch, neutral, divergence, live
  
  // Player state
  const [playerProfile, setPlayerProfile] = useState(DEFAULT_PROFILE);
  const [playerSide, setPlayerSide] = useState(null); // which token player is backing
  const [playerWallet, setPlayerWallet] = useState({
    ETH: DEFAULT_PROFILE.balances.ETH,
    FINAL: DEFAULT_PROFILE.balances.FINAL,
    '3TOED': DEFAULT_PROFILE.balances['3TOED'],
    'MNRCH': DEFAULT_PROFILE.balances['MNRCH']
  });
  
  // Battle state
  const [fighterHP, setFighterHP] = useState({
    '3TOED': TOKEN_CONFIG.game.startingHP,
    'MNRCH': TOKEN_CONFIG.game.startingHP
  });
  
  const [momentum, setMomentum] = useState({
    '3TOED': 0,
    'MNRCH': 0
  });
  
  const [currentMoves, setCurrentMoves] = useState({
    '3TOED': null,
    'MNRCH': null
  });
  
  const [battleLog, setBattleLog] = useState([]);
  const [marketCommentary, setMarketCommentary] = useState(null);
  
  // Market data
  const [marketData, setMarketData] = useState({
    PEPE: { price: 0, change: 0, volume: 0 },
    DOGE: { price: 0, change: 0, volume: 0 },
    ARB: { price: 0, change: 0, volume: 0 }
  });
  
  // Refs for intervals
  const roundIntervalRef = useRef(null);
  const minorMoveTimeoutRef = useRef(null);
  
  // Helper function to get random popup message
  const getRandomPopup = (category) => {
    const messages = marketPopups.popups[category];
    if (!messages || messages.length === 0) return null;
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  // Check if player has enough $FINAL to play
  const canPlay = useCallback(() => {
    return playerWallet.FINAL >= TOKEN_CONFIG.finalToken.gateAmount;
  }, [playerWallet.FINAL]);
  
  // Start a new game
  const startGame = useCallback(async () => {
    if (!canPlay()) {
      setMarketCommentary("You need at least 50 $FINAL to play!");
      return false;
    }
    
    setGameState('playing');
    setCurrentRound(1);
    setRoundTimer(TOKEN_CONFIG.game.countdownStart);
    setFighterHP({
      '3TOED': TOKEN_CONFIG.game.startingHP,
      'MNRCH': TOKEN_CONFIG.game.startingHP
    });
    setMomentum({ '3TOED': 0, 'MNRCH': 0 });
    
    // Initial market commentary
    const startMessage = getRandomPopup('round_pacing');
    setBattleLog([{
      timestamp: Date.now(),
      message: "Battle begins! 3TOED vs MNRCH!",
      type: 'start'
    }]);
    
    if (startMessage) {
      setMarketCommentary(startMessage);
    }
    
    // Fetch initial market data
    if (marketMode === 'live') {
      await fetchLiveMarketData();
    } else {
      // Load scenario data
      loadScenarioData();
    }
    
    // Start round timer
    startRoundTimer();
    
    return true;
  }, [canPlay, marketMode]);
  
  // Load scenario market data
  const loadScenarioData = useCallback(() => {
    // Check if marketScenarios structure exists
    if (!marketScenarios || !marketScenarios.scenarios) {
      console.error('Market scenarios not loaded properly');
      return;
    }
    
    const scenario = marketScenarios.scenarios[marketMode];
    if (!scenario || !scenario.rounds) {
      console.error(`No scenario found for mode: ${marketMode}`);
      return;
    }
    
    const roundIndex = Math.max(0, currentRound - 1);
    const roundData = scenario.rounds[roundIndex] || scenario.rounds[0];
    
    if (!roundData) {
      console.error('No round data available');
      return;
    }
    
    setMarketData({
      PEPE: { 
        price: 0.00001, // Mock price
        change: roundData.PEPE?.priceChange || 0,
        volume: roundData.PEPE?.volume || 0
      },
      DOGE: {
        price: 0.08,
        change: roundData.DOGE?.priceChange || 0,
        volume: roundData.DOGE?.volume || 0
      }
    });
    
    // Generate market commentary based on data
    if (Math.abs(roundData.PEPE?.priceChange || 0) > 5 || Math.abs(roundData.DOGE?.priceChange || 0) > 5) {
      setMarketCommentary(getRandomPopup('price_surge'));
    } else if ((roundData.PEPE?.volume || 0) > 300000 || (roundData.DOGE?.volume || 0) > 500000) {
      setMarketCommentary(getRandomPopup('volume_spike'));
    }
  }, [marketMode, currentRound]);
  
  // Round timer logic
  const startRoundTimer = useCallback(() => {
    if (roundIntervalRef.current) {
      clearInterval(roundIntervalRef.current);
    }
    
    roundIntervalRef.current = setInterval(() => {
      setRoundTimer(prev => {
        if (prev <= 1) {
          // Round ends
          processRoundEnd();
          return TOKEN_CONFIG.game.countdownStart;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);
  
  // Process round end
  const processRoundEnd = useCallback(async () => {
    // Load current round market data
    if (marketMode !== 'live') {
      loadScenarioData();
    }
    
    // Get market data for this round
    const roundMarketData = await getRoundMarketData();
    
    // Calculate market tiers
    const pepeTier = CoinGeckoService.getTierFromPriceChange(roundMarketData.PEPE.change);
    const dogeTier = CoinGeckoService.getTierFromPriceChange(roundMarketData.DOGE.change);
    
    // Prepare round data
    const roundData = {
      sloth: {
        marketTier: pepeTier,
        momentum: momentum['3TOED'],
        finalBalance: playerWallet.FINAL,
        priceChange: roundMarketData.PEPE.change,
        volume: roundMarketData.PEPE.volume
      },
      monarch: {
        marketTier: dogeTier,
        momentum: momentum['MNRCH'],
        finalBalance: playerSide === 'MNRCH' ? playerWallet.FINAL : 50, // AI gets base amount
        priceChange: roundMarketData.DOGE.change,
        volume: roundMarketData.DOGE.volume
      }
    };
    
    // Determine outcome
    const outcome = GameMechanicsService.determineRoundOutcome(roundData);
    
    // Apply damage
    setFighterHP(prev => ({
      ...prev,
      [outcome.loser]: Math.max(0, prev[outcome.loser] - outcome.damage)
    }));
    
    // Update battle log
    setBattleLog(prev => [...prev, {
      timestamp: Date.now(),
      round: currentRound,
      message: `${outcome.winner} lands ${outcome.majorMove.name}! ${outcome.damage} damage!`,
      type: 'major',
      move: outcome.majorMove,
      outcome
    }]);
    
    // Generate strength feedback
    setMarketCommentary(getRandomPopup('strength_feedback'));
    
    // Set current major move for animation
    setCurrentMoves(prev => ({
      ...prev,
      [outcome.winner]: {
        ...outcome.majorMove,
        type: 'major',
        tier: outcome.damage
      }
    }));
    
    // Clear major move after animation
    setTimeout(() => {
      setCurrentMoves(prev => ({
        ...prev,
        [outcome.winner]: null
      }));
    }, TOKEN_CONFIG.game.moveAnimationDuration * 1000);
    
    // Reset momentum for next round
    setMomentum({ '3TOED': 0, 'MNRCH': 0 });
    
    // Check for game end
    const updatedHP = {
      ...fighterHP,
      [outcome.loser]: Math.max(0, fighterHP[outcome.loser] - outcome.damage)
    };
    
    if (updatedHP['3TOED'] <= 0 || updatedHP['MNRCH'] <= 0) {
      endGame(updatedHP['3TOED'] > 0 ? '3TOED' : 'MNRCH');
    } else {
      // Continue to next round
      setCurrentRound(prev => prev + 1);
      
      // Round pacing message
      setTimeout(() => {
        setMarketCommentary(getRandomPopup('round_pacing'));
      }, 3000);
    }
  }, [currentRound, momentum, playerWallet.FINAL, playerSide, fighterHP, marketMode]);
  
  // Get market data for current round
  const getRoundMarketData = useCallback(async () => {
    if (marketMode === 'live') {
      // Fetch live data
      const [pepeData, dogeData] = await Promise.all([
        CoinGeckoService.getPriceChange('pepe', 30),
        CoinGeckoService.getPriceChange('dogecoin', 30)
      ]);
      
      return {
        PEPE: { change: pepeData.changePercent, volume: pepeData.volume },
        DOGE: { change: dogeData.changePercent, volume: dogeData.volume }
      };
    } else {
      // Use pre-loaded scenario data
      if (!marketScenarios || !marketScenarios.scenarios || !marketScenarios.scenarios[marketMode]) {
        console.error('Market scenarios not properly loaded');
        return {
          PEPE: { change: 0, volume: 0 },
          DOGE: { change: 0, volume: 0 }
        };
      }
      
      const scenario = marketScenarios.scenarios[marketMode];
      const roundIndex = Math.max(0, currentRound - 1);
      const roundData = scenario.rounds?.[roundIndex] || scenario.rounds?.[0] || {};
      
      return {
        PEPE: { 
          change: roundData.PEPE?.priceChange || 0, 
          volume: roundData.PEPE?.volume || 0 
        },
        DOGE: { 
          change: roundData.DOGE?.priceChange || 0, 
          volume: roundData.DOGE?.volume || 0 
        }
      };
    }
  }, [marketMode, currentRound]);
  
  // Handle player trade
  const executeTrade = useCallback((action, token, amount) => {
    if (gameState !== 'playing' && token !== 'FINAL') return;
    
    // Special handling for FINAL token reload
    if (token === 'FINAL' && action === 'buy') {
      // ETH to FINAL conversion
      const ethCost = amount * 0.1; // 10 FINAL per ETH
      if (playerWallet.ETH < ethCost) {
        setMarketCommentary("Insufficient ETH!");
        return;
      }
      
      setPlayerWallet(prev => ({
        ...prev,
        ETH: prev.ETH - ethCost,
        FINAL: prev.FINAL + amount
      }));
      
      setBattleLog(prev => [...prev, {
        timestamp: Date.now(),
        message: `Reloaded ${amount} $FINAL!`,
        type: 'trade'
      }]);
      
      // Check for regen
      const regenHP = GameMechanicsService.calculateRegen(amount);
      if (regenHP > 0 && playerSide) {
        setFighterHP(prev => ({
          ...prev,
          [playerSide]: Math.min(TOKEN_CONFIG.game.startingHP, prev[playerSide] + regenHP)
        }));
        
        setMarketCommentary(getRandomPopup('buff_trigger'));
      }
      
      return;
    }
    
    // Regular fighter token trades
    if (action === 'buy') {
      const finalCost = amount * 0.1; // 1 FINAL = 10 tokens
      if (playerWallet.FINAL < finalCost) {
        setMarketCommentary("Insufficient $FINAL!");
        return;
      }
      
      // Update wallet
      setPlayerWallet(prev => ({
        ...prev,
        FINAL: prev.FINAL - finalCost,
        [token]: prev[token] + amount
      }));
    } else {
      if (playerWallet[token] < amount) {
        setMarketCommentary("Insufficient tokens!");
        return;
      }
      
      // Update wallet
      setPlayerWallet(prev => ({
        ...prev,
        FINAL: prev.FINAL + (amount * 0.1),
        [token]: prev[token] - amount
      }));
    }
    
    // Process trade impact
    const tradeResult = GameMechanicsService.processTrade({
      fighter: token,
      action,
      amount,
      playerProfile
    });
    
    // Update momentum
    setMomentum(prev => ({
      ...prev,
      [token]: Math.min(5, prev[token] + tradeResult.momentumGained)
    }));
    
    // Show minor move
    setCurrentMoves(prev => ({
      ...prev,
      [token]: {
        ...tradeResult.minorMove,
        type: 'momentum',
        direction: action === 'buy' ? 'up' : 'down'
      }
    }));
    
    // Clear minor move after short duration
    if (minorMoveTimeoutRef.current) {
      clearTimeout(minorMoveTimeoutRef.current);
    }
    
    minorMoveTimeoutRef.current = setTimeout(() => {
      setCurrentMoves(prev => ({
        ...prev,
        [token]: null
      }));
    }, TOKEN_CONFIG.game.minorMoveCooldown * 1000);
    
    // Add to battle log
    setBattleLog(prev => [...prev, {
      timestamp: Date.now(),
      message: `${action.toUpperCase()} ${amount} ${token}!`,
      type: 'trade',
      minor: tradeResult.minorMove
    }]);
    
    // Update commentary
    setMarketCommentary(getRandomPopup('player_input'));
  }, [gameState, playerWallet, playerProfile, playerSide]);
  
  // Buy $FINAL with ETH
  const buyFinal = useCallback((ethAmount) => {
    const finalAmount = ethAmount * 10; // Simplified exchange rate
    
    if (playerWallet.ETH < ethAmount) {
      setMarketCommentary("Insufficient ETH!");
      return false;
    }
    
    setPlayerWallet(prev => ({
      ...prev,
      ETH: prev.ETH - ethAmount,
      FINAL: prev.FINAL + finalAmount
    }));
    
    // Check for regen
    const regenHP = GameMechanicsService.calculateRegen(finalAmount);
    if (regenHP > 0 && playerSide) {
      setFighterHP(prev => ({
        ...prev,
        [playerSide]: Math.min(TOKEN_CONFIG.game.startingHP, prev[playerSide] + regenHP)
      }));
      
      setMarketCommentary(getRandomPopup('buff_trigger'));
    }
    
    return true;
  }, [playerWallet.ETH, playerSide]);
  
  // End game
  const endGame = useCallback((winner) => {
    setGameState('ended');
    
    if (roundIntervalRef.current) {
      clearInterval(roundIntervalRef.current);
    }
    
    setBattleLog(prev => [...prev, {
      timestamp: Date.now(),
      message: `${winner} WINS!`,
      type: 'end',
      winner
    }]);
    
    setMarketCommentary(`GAME OVER! ${winner} emerges victorious!`);
  }, []);
  
  // Fetch live market data
  const fetchLiveMarketData = useCallback(async () => {
    try {
      const prices = await CoinGeckoService.getCurrentPrices(['pepe', 'dogecoin', 'arbitrum']);
      
      setMarketData({
        PEPE: {
          price: prices.pepe?.usd || 0,
          change: prices.pepe?.usd_24h_change || 0,
          volume: prices.pepe?.usd_24h_vol || 0
        },
        DOGE: {
          price: prices.dogecoin?.usd || 0,
          change: prices.dogecoin?.usd_24h_change || 0,
          volume: prices.dogecoin?.usd_24h_vol || 0
        },
        ARB: {
          price: prices.arbitrum?.usd || 0,
          change: prices.arbitrum?.usd_24h_change || 0,
          volume: prices.arbitrum?.usd_24h_vol || 0
        }
      });
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }, []);
  
  // Load market data when round changes
  useEffect(() => {
    if (gameState === 'playing' && currentRound > 0) {
      loadScenarioData();
    }
  }, [currentRound, gameState, loadScenarioData]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roundIntervalRef.current) {
        clearInterval(roundIntervalRef.current);
      }
      if (minorMoveTimeoutRef.current) {
        clearTimeout(minorMoveTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <GameContext.Provider value={{
      // Game state
      gameState,
      currentRound,
      roundTimer,
      marketMode,
      setMarketMode,
      
      // Player state
      playerProfile,
      setPlayerProfile,
      playerSide,
      setPlayerSide,
      playerWallet,
      
      // Battle state
      fighterHP,
      momentum,
      currentMoves,
      battleLog,
      marketCommentary,
      
      // Market data
      marketData,
      
      // Actions
      canPlay,
      startGame,
      executeTrade,
      buyFinal,
      
      // Config
      tokenConfig: TOKEN_CONFIG,
      playerProfiles: PLAYER_PROFILES
    }}>
      {children}
    </GameContext.Provider>
  );
};