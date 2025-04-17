import React from 'react';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 40 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 512 512" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ minWidth: size }}
      >
        <path
          d="M180 140
             L380 140
             L380 220
             L260 220
             L260 250
             L340 250
             L340 330
             L260 330
             L260 420
             L180 420
             Z"
          fill="#FF5733"
        />
      </svg>
      <span style={{ 
        color: '#FF5733', 
        fontSize: `${size * 0.5}px`,
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
      }}>
        FLESK WALLET
      </span>
    </div>
  );
};

export default Logo; 