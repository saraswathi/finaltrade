import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ImageTest = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: 'white' }}>
        Image Test Page
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Background Image:</Typography>
          <img 
            src={process.env.PUBLIC_URL + "/assets/images/cyberpunk-alley-bg.jpg"} 
            alt="Background" 
            style={{ width: '300px', border: '1px solid white' }} 
          />
        </Box>
        
        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Logo Images:</Typography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <img 
              src={process.env.PUBLIC_URL + "/assets/images/toed-logo.png"} 
              alt="TOED Logo" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
            <img 
              src={process.env.PUBLIC_URL + "/assets/images/mnrch-logo.png"} 
              alt="MNRCH Logo" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
          </div>
        </Box>
        
        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Character Images:</Typography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <img 
              src={`${process.env.PUBLIC_URL}/assets/images/monarch.png`} 
              alt="Monarch" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
            <img 
              src={`${process.env.PUBLIC_URL}/assets/images/sloth.png`} 
              alt="Sloth" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
          </div>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ color: 'white' }}>Simple Test:</Typography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAB00lEQVR4nO3csU7CUBSA4XNpIsnAxAyuDAwGdh9B30EXEzc3F30DF3wSY+LD6KSbTDqdpQkTi4GEwXCxNS0t/Kf9vvGUptzk/BduaQtIkiRJkiRJkiRJkiRJkiRJkiRJklZBVfrAgLvADfAMzIAp8AKMgN61D1fYEHgETkBmjAnwAHRrHHhGcRz7t/79uALegefAsx3lMXQDPzAGNiInztc28AE8BZ5zaYMC1xpE/vl12AcmgWddyt2Sa38nrT7kfc58Bl79bQ/YLPC5jdBL3uCRNHl/jYA4qahFXYEX8qQ9xw5WnWdgC9hImqq5nchifAObSRM1VzkNAuCOfMNoratymoQ/4m1Vxs8ib/JzVuGgprHLDWbkS1ZrfVdWPFpXPBbVxfj/MIiYQcQMImYQMYOIGUTMIGIGETOImEHEDCJmEDGDiBlEzCBiBhEziJhBxAwiZhAxg4gZRMwgYgYRM4iYQcQMImYQMYOIGUTMIGIGETOIWGgQH9e+kF4ZeO32eYYNIy/2cWkvrZixJwn/9rnAwd9KLHA0g3wbUi2DqiE7JBzNoNqmgQOVNmBOjJnk46ZxmfPNgCvydPYkSZIkSZIkSZIkSZIkSZIkSZKkJvgCeRdUgI/ja3MAAAAASUVORK5CYII=" 
              alt="Test" 
              style={{ width: '100px', border: '1px solid white' }} 
            />
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default ImageTest;
