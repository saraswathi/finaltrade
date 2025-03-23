import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useWeb3 from '../../hooks/useWeb3';

const Header = () => {
  const { connectWallet, isConnected, account, disconnectWallet } = useWeb3();
  
  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`;
  };

  return (
    <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            flexGrow: 1
          }}
          className="neon-text"
        >
          ✧ FINAL TRADE
        </Typography>
        
        {isConnected ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={disconnectWallet}
            sx={{ borderRadius: '50px' }}
          >
            {formatAddress(account)}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={connectWallet}
            sx={{ borderRadius: '50px' }}
          >
            Connect Wallet
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
