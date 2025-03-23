import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Statistics = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" className="neon-text" sx={{ mb: 4, textAlign: 'center' }}>
        Statistics
      </Typography>
      
      <Box sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5">
          Statistics dashboard coming soon
        </Typography>
      </Box>
    </Container>
  );
};

export default Statistics;
