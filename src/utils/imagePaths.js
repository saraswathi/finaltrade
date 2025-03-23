
// Handles image paths for consistent references across environments
const getImagePath = (imageName) => {
  // Use absolute URL for deployed site
  if (process.env.NODE_ENV === 'production') {
    return `https://saraswathi.github.io/finaltrade/assets/images/${imageName}`;
  }
  // Use relative path for development
  return `${process.env.PUBLIC_URL}/assets/images/${imageName}`;
};

// Export specific image paths for easy access
export const IMAGES = {
  background: getImagePath('cyberpunk-alley-bg.jpg'),
  toedLogo: getImagePath('toed-logo.png'),
  mnrchLogo: getImagePath('mnrch-logo.png'),
  monarch: getImagePath('monarch.png'),
  sloth: getImagePath('sloth.png'),
};

export default getImagePath;