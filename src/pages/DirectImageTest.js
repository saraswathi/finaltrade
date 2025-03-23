import React from 'react';

const DirectImageTest = () => {
  return (
    <div>
      <h2>Direct Image Test</h2>
      <div>
        <img 
          src="https://saraswathi.github.io/finaltrade/assets/images/cyberpunk-alley-bg.jpg" 
          alt="Background" 
          style={{ width: '400px', border: '1px solid white' }} 
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        <div>
          <h3>$3TOED Logo</h3>
          <img 
            src="https://saraswathi.github.io/finaltrade/assets/images/toed-logo.png" 
            alt="3TOED Logo" 
            style={{ width: '100px', border: '1px solid white' }} 
          />
        </div>
        <div>
          <h3>$MNRCH Logo</h3>
          <img 
            src="https://saraswathi.github.io/finaltrade/assets/images/mnrch-logo.png" 
            alt="MNRCH Logo" 
            style={{ width: '100px', border: '1px solid white' }} 
          />
        </div>
        <div>
          <h3>Monarch Butterfly</h3>
          <img 
            src="https://saraswathi.github.io/finaltrade/assets/images/monarch.png" 
            alt="Monarch" 
            style={{ width: '100px', border: '1px solid white' }} 
          />
        </div>
        <div>
          <h3>Sloth</h3>
          <img 
            src="https://saraswathi.github.io/finaltrade/assets/images/sloth.png" 
            alt="Sloth" 
            style={{ width: '100px', border: '1px solid white' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default DirectImageTest;
