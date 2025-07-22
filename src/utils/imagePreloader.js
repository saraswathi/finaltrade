// imagePreloader.js - Utility to preload battle images

const imageCache = new Map();

// List of images to preload
const battleImages = [
  // Idle
  'characters/idle/fighters_idle.png',
  
  // Attacks
  'characters/attacks/sloth_attack_1.png',
  'characters/attacks/sloth_attack_2.png',
  'characters/attacks/sloth_attack_3.png',
  'characters/attacks/sloth_attack_4.png',
  'characters/attacks/sloth_attack_5.png',
  'characters/attacks/monarch_attack_1.png',
  'characters/attacks/monarch_attack_2.png',
  'characters/attacks/monarch_attack_3.png',
  'characters/attacks/monarch_attack_4.png',
  'characters/attacks/monarch_attack_5.png',
  
  // Momentum
  'characters/momentum/sloth_momentum_up.png',
  'characters/momentum/sloth_momentum_down.png',
  'characters/momentum/monarch_momentum_up.png',
  'characters/momentum/monarch_momentum_down.png',
  
  // Special
  'characters/special/both_hurt.png',
  'characters/special/monarch_victory.png',
  'characters/special/sloth_victory.png'
];

// Preload a single image
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve(imageCache.get(src));
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      reject(new Error(`Failed to load ${src}`));
    };
    img.src = src;
  });
};

// Preload all battle images
export const preloadBattleImages = async () => {
  const basePath = `${process.env.PUBLIC_URL}/assets/images`;
  const promises = battleImages.map(imageName => 
    preloadImage(`${basePath}/${imageName}`).catch(err => {
      // Don't let one failed image stop the others
      console.warn(err);
      return null;
    })
  );

  try {
    await Promise.all(promises);
    console.log('Battle images preloaded successfully');
  } catch (error) {
    console.error('Error preloading images:', error);
  }
};

// Get cached image or return placeholder
export const getCachedImage = (imagePath) => {
  return imageCache.get(imagePath) || null;
};