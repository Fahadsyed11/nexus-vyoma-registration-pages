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
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        overflow: 'hidden',
        pointerEvents: 'none',
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
        >
          <Aurora
            colorStops={['#3c0fef', '#f51414', '#ffb127']}
            amplitude={1}
            blend={0.5}
            speed={1}
          />
        </div>
      </div>
    </div>
  );
}
