import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, styled, Fade } from '@mui/material';

const CommentaryContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(3),
  left: theme.spacing(3),
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1.5),
  maxWidth: 400,
  zIndex: 20,
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    right: theme.spacing(2),
    maxWidth: 'calc(100% - 32px)',
  }
}));

const CommentBubble = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(20, 20, 30, 0.95)',
  border: '2px solid #00FFF7',
  borderRadius: 20,
  padding: theme.spacing(2),
  position: 'relative',
  boxShadow: '0 0 20px rgba(0, 255, 247, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 10,
    left: -10,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '10px 15px 10px 0',
    borderColor: 'transparent #00FFF7 transparent transparent',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 12,
    left: -7,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '8px 12px 8px 0',
    borderColor: 'transparent rgba(20, 20, 30, 0.95) transparent transparent',
  }
}));

const MossmouthAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: '#1a0033',
  border: '3px solid #00FFF7',
  boxShadow: '0 0 15px rgba(0, 255, 247, 0.5)',
  [theme.breakpoints.down('sm')]: {
    width: 50,
    height: 50,
  }
}));

const MossmouthCommentary = ({ message, trigger }) => {
  const [show, setShow] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  // Market commentary messages
  const commentaries = {
    roundStart: [
      "The market stirs... who will strike first?",
      "Tension builds as traders prepare...",
      "Another round begins in the eternal struggle."
    ],
    buyPressure: [
      "Buy walls rising! The bulls are charging!",
      "Green candles ignite—momentum shifts!",
      "The order book trembles with buy pressure!"
    ],
    sellPressure: [
      "Sell walls forming—bears take control!",
      "Red candles cascade—protect your positions!",
      "Panic spreads through the market!"
    ],
    momentum: [
      "Momentum builds... can they sustain it?",
      "The tide is turning—feel the shift!",
      "Power flows through the market veins!"
    ],
    fightStart: [
      "Here it comes! Brace for impact!",
      "The moment of truth arrives!",
      "Market forces collide!"
    ],
    victory: [
      "The dust settles... a new champion emerges.",
      "Victory through market mastery!",
      "The strong survive, the weak are liquidated."
    ]
  };

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      setShow(true);
    } else if (trigger) {
      // Select random message based on trigger type
      const messages = commentaries[trigger] || commentaries.roundStart;
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
      setShow(true);
    }

    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, trigger]);

  return (
    <Fade in={show}>
      <CommentaryContainer>
        <MossmouthAvatar>
          <img 
            src={`${process.env.PUBLIC_URL}/assets/images/mossmouth-icon.png`}
            alt="Mossmouth"
            style={{ width: '100%', height: '100%' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = 'M';
            }}
          />
        </MossmouthAvatar>
        <CommentBubble>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#00FFF7',
              fontWeight: 'bold',
              display: 'block',
              mb: 0.5
            }}
          >
            Mossmouth
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontStyle: 'italic'
            }}
          >
            {currentMessage}
          </Typography>
        </CommentBubble>
      </CommentaryContainer>
    </Fade>
  );
};

export default MossmouthCommentary;