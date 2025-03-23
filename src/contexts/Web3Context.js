import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create context
export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Simulate wallet connection
  const connectWallet = async () => {
    try {
      // This is a mock function for the prototype
      setAccount('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
      setIsConnected(true);
      return true;
    } catch (error) {
      console.error("Connection error:", error);
      return false;
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    setAccount('');
    setIsConnected(false);
  };

  // For simulation mode
  const simulateConnection = () => {
    setAccount('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
    setIsConnected(true);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        connectWallet,
        disconnectWallet,
        simulateConnection, 
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
