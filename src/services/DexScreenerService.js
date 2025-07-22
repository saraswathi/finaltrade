/**
 * Service for interacting with DexScreener API
 */
const DexScreenerService = {
  // Cache to store historical price data for volatility calculation
  priceHistory: {
    OpenX: [],
    ITP: []
  },
  
  // Fetch token pair data from DexScreener API
  fetchPairData: async (chain, pairAddress) => {
    try {
      console.log(`Fetching data for pair ${pairAddress} on ${chain}...`);
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`,
        {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache' // Ensure we get fresh data
          }
        }
      );

      if (!response.ok) {
        throw new Error(`DexScreener API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error("Error fetching pair data:", error);
      return null;
    }
  },

  // Calculate volatility using standard deviation of price changes
  calculateVolatility: (tokenId, currentPrice) => {
    const maxHistoryPoints = 20; // Number of data points to consider
    const history = DexScreenerService.priceHistory[tokenId] || [];
    
    // Add current price to history
    if (currentPrice) {
      history.push({
        price: currentPrice,
        timestamp: Date.now()
      });
      
      // Keep history limited to maxHistoryPoints
      if (history.length > maxHistoryPoints) {
        history.shift();
      }
      
      // Update the history in the cache
      DexScreenerService.priceHistory[tokenId] = history;
    }
    
    // Need at least 3 data points for meaningful volatility
    if (history.length < 3) {
      return 0.2; // Default volatility when not enough data
    }
    
    // Calculate percentage changes between consecutive prices
    const priceChanges = [];
    for (let i = 1; i < history.length; i++) {
      const prevPrice = history[i-1].price;
      const currPrice = history[i].price;
      if (prevPrice && prevPrice > 0) {
        const pctChange = ((currPrice - prevPrice) / prevPrice) * 100;
        priceChanges.push(pctChange);
      }
    }
    
    if (priceChanges.length < 2) {
      return 0.3; // Default when not enough change data
    }
    
    // Calculate standard deviation of changes
    const mean = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length;
    const squaredDiffs = priceChanges.map(change => Math.pow(change - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const stdDev = Math.sqrt(variance);
    
    // Normalize to 0-1 scale for the game's volatility meter (cap at 1.0)
    const normalizedVolatility = Math.min(Math.abs(stdDev / 10), 1);
    
    return normalizedVolatility;
  },
  
  // Clear price history (useful for resets)
  clearPriceHistory: () => {
    DexScreenerService.priceHistory = {
      OpenX: [],
      ITP: []
    };
  }
};

export default DexScreenerService;