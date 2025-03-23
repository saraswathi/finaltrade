import { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

/**
 * Custom hook to access the Web3 context
 * @returns {Object} Web3 context values and functions
 */
const useWeb3 = () => {
  const context = useContext(Web3Context);
  
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  
  return context;
};

export default useWeb3;
