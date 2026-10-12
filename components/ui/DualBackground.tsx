'use client';

import React from 'react';
import Aurora from './Aurora';

interface DualBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Aurora Fluid Waves Background
 * Fixed global background extending behind the entire webpage content.
 */
export default function DualBackground({
  className = '',
  style,
}: DualBackgroundProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '55vh',
        maxHeight: '55vh',
        zIndex: -9,
        overflow: 'hidden',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        ...style,
      }}
      className={className}
      aria-hidden="true"
    >
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
          className="opacity-25 sm:opacity-40 transition-opacity duration-300"
        >
          <Aurora
            colorStops={['#3c0fef', '#f51414', '#ffb127']}
            amplitude={0.8}
            blend={0.5}
            speed={0.8}
          />
        </div>
      </div>
    </div>
  );
}
