// Handles image paths for consistent references across environments
const getImagePath = (imageName) => {
  // In production, use PUBLIC_URL which includes the repository name
  if (process.env.NODE_ENV === 'production') {
    return `${process.env.PUBLIC_URL}/assets/images/${imageName}`;
  }
  // Use relative path for development
  return `/assets/images/${imageName}`;
};

// Export specific image paths for easy access
export const IMAGES = {
  background: getImagePath('neon_hum.png'), // Changed to neon_hum.png as the main background
  toedLogo: getImagePath('toed-logo.png'),
  mnrchLogo: getImagePath('mnrch-logo.png'),
  monarch: getImagePath('monarch.png'),
  sloth: getImagePath('sloth.png'),
  neonHum: getImagePath('neon_hum.png'),
  solarArena: getImagePath('Solar_Cyber_Arena.png'),
  logo: getImagePath('final_trade_logo.png'),
};

export default getImagePath;