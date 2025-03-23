import React from 'react';
import { Container, Typography, Box, Grid, Button, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useWeb3 from '../hooks/useWeb3';

// Image path utility (same as in App.js)
const getImagePath = (imageName) => {
  // Use absolute URL for deployed site
  if (process.env.NODE_ENV === 'production') {
    return `https://saraswathi.github.io/finaltrade/assets/images/${imageName}`;
  }
  // Use relative path for development
  return `${process.env.PUBLIC_URL}/assets/images/${imageName}`;
};

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

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={5}>
          <Card 
            sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.2)', 
              border: '1px solid rgba(76, 175, 80, 0.5)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)'
              }
            }}
          >
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <img 
                src={getImagePath('toed-logo.png')} 
                alt="3TOED Token"
                style={{ height: 80, marginBottom: 16 }}
              />
              <Typography variant="h4" className="monarch-neon" gutterBottom>
                3TOED MONARCH
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <img 
                  src={getImagePath('monarch.png')}
                  alt="Monarch Butterfly"
                  style={{ height: 120, marginBottom: 16 }}
                />
              </Box>
              <Button 
                fullWidth
                variant="contained"
                color="success"
                onClick={() => handlePlay('toed')}
                sx={{ py: 2, mt: 2 }}
              >
                Play as $3TOED
              </Button>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card 
            sx={{ 
              bgcolor: 'rgba(156, 39, 176, 0.2)', 
              border: '1px solid rgba(156, 39, 176, 0.5)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)'
              }
            }}
          >
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <img 
                src={getImagePath('mnrch-logo.png')} 
                alt="MNRCH Token"
                style={{ height: 80, marginBottom: 16 }}
              />
              <Typography variant="h4" className="sloth-neon" gutterBottom>
                MNRCH SLOTH
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <img 
                  src={getImagePath('sloth.png')}
                  alt="Sloth"
                  style={{ height: 120, marginBottom: 16 }}
                />
              </Box>
              <Button 
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => handlePlay('mnrch')}
                sx={{ py: 2, mt: 2 }}
              >
                Play as $MNRCH
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;