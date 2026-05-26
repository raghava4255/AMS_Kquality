import React from 'react';

/**
 * QualitySoft Logo — Pure SVG, no external images required.
 * Matches the provided brand image: red pin with white circle & red K,
 * followed by "QualitySoft" bold text and "Knowledge & Quality" tagline.
 *
 * Props:
 *   size     — controls overall scale (default 44 = height of pin icon)
 *   variant  — "full" (icon + text) | "icon" (just the pin)
 *   light    — boolean, renders text in dark color for light backgrounds
 */
const Logo = ({ size = 44, variant = 'full', light = false }) => {
  const textColor = light ? '#1a1a2e' : '#ffffff';
  const taglineColor = light ? '#555566' : 'rgba(255,255,255,0.65)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
      {/* Pin SVG Icon */}
      <svg
        width={size}
        height={size * 1.25}
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="QualitySoft logo"
      >
        {/* Drop shadow filter */}
        <defs>
          <filter id="logo-shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#c0000055" />
          </filter>
        </defs>

        {/* Outer pin shape — red */}
        <path
          d="M40 2C22.4 2 8 16.4 8 34C8 54.6 40 98 40 98C40 98 72 54.6 72 34C72 16.4 57.6 2 40 2Z"
          fill="#E01B24"
          filter="url(#logo-shadow)"
        />

        {/* Inner white circle */}
        <circle cx="40" cy="34" r="20" fill="#ffffff" />

        {/* Red K letter */}
        <text
          x="40"
          y="43"
          textAnchor="middle"
          fontFamily="'Outfit', 'Inter', Arial, sans-serif"
          fontWeight="900"
          fontSize="26"
          fill="#E01B24"
          letterSpacing="-1"
        >
          K
        </text>
      </svg>

      {/* Text block — hidden in icon-only mode */}
      {variant === 'full' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span
            style={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: `${size * 0.52}px`,
              color: textColor,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            QualitySoft
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: `${size * 0.28}px`,
              color: taglineColor,
              letterSpacing: '0.01em',
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
