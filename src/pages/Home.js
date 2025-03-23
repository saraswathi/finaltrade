import React from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useWeb3 from '../hooks/useWeb3';

const Home = () => {
  const navigate = useNavigate();
  const { connectWallet, isConnected } = useWeb3();

  // Navigate to battle page
  const handlePlay = (token) => {
    navigate('/battle', { state: { selectedToken: token } });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h1" 
          className="neon-text"
          sx={{ mb: 2 }}
        >
          ✧ FINAL TRADE
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '700px',
            mx: 'auto',
            mb: 4,
          }}
        >
          The ultimate marketplace battleground where species tokens fight for dominance. 
          Your trades determine the winner.
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Button 
            variant="contained" 
            color="primary"
            sx={{ px: 4, py: 1.5 }}
          >
            Read Greypaper
          </Button>
          
          {!isConnected && (
            <Button 
              variant="contained" 
              color="secondary"
              onClick={connectWallet}
              sx={{ px: 4, py: 1.5 }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={5}>
          <Button 
            fullWidth
            variant="contained"
            color="success"
            onClick={() => handlePlay('toed')}
            sx={{ py: 2 }}
          >
            Play as $3TOED
          </Button>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Button 
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => handlePlay('mnrch')}
            sx={{ py: 2 }}
          >
            Play as $MNRCH
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
