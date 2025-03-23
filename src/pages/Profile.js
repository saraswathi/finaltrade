import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import useWeb3 from '../hooks/useWeb3';

const Profile = () => {
  const { account, isConnected } = useWeb3();
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" className="neon-text" sx={{ mb: 4, textAlign: 'center' }}>
        Profile
      </Typography>
      
      {isConnected ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            Connected Address:
          </Typography>
          <Typography variant="body1">
            {account}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5">
            Please connect your wallet to view your profile
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Profile;
