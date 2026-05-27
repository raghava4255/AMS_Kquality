import React from 'react';
import logo from '../assets/kqualitysoft-logo.png';

const Logo = ({
  size = 220,
  variant = 'full',
  light = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: `${size * 0.06}px`,
        userSelect: 'none',
      }}
    >
      {/* Logo Image */}
      <img
        src={logo}
        alt="QualitySoft Logo"
        style={{
          width: variant === 'icon' ? `${size * 0.80}px` : `${size * 0.80}px`,
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />

      {/* Text Section */}
      {variant === 'full' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: 1.1,
          }}
        >
          {/* Company Name */}
          <span
            style={{
              fontFamily: "'Times New Roman', serif",
              fontWeight: '700',
              fontSize: `${size * 0.70}px`,
              color: light ? '#0a0000' : '#000000',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            QualitySoft
          </span>

          {/* Tagline */}
          <span
            style={{
              marginTop: `${size * 0.08}px`,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '400',
              fontSize: `${size * 0.28}px`,
              color: light ? '#090101' : '#555555',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
          >
            Knowledge &amp; Quality
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;