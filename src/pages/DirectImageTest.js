import React from 'react';
import { Container, Typography, Box } from '@mui/material';

// Import images directly
import backgroundImage from '../images/cyberpunk-alley-bg.jpg';
import toedLogo from '../images/toed-logo.png';
import mnrchLogo from '../images/mnrch-logo.png';
import monarchImage from '../images/monarch.png';
import slothImage from '../images/sloth.png';

const DirectImageTest = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: 'white' }}>
        Direct Image Import Test
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Background Image:</Typography>
          <img 
            src={backgroundImage} 
            alt="Background" 
            style={{ width: '300px', border: '1px solid white' }} 
          />
        </Box>
        
        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Logo Images:</Typography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <img 
              src={toedLogo} 
              alt="TOED Logo" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
            <img 
              src={mnrchLogo} 
              alt="MNRCH Logo" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
          </div>
        </Box>
        
        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Character Images:</Typography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <img 
              src={monarchImage} 
              alt="Monarch" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
            <img 
              src={slothImage} 
              alt="Sloth" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default DirectImageTest;
