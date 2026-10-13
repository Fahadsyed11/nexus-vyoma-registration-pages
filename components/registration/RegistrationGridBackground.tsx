import React from 'react';
import ShapeGrid from '@/components/ui/ShapeGrid';

/**
 * RegistrationGridBackground
 * Full-bleed React Bits <ShapeGrid /> over pure black, shared by the
 * Check Email and Verify Email pages. The wrapper ignores pointer events so
 * forms stay interactive; ShapeGrid listens on `window` for cursor light + click cascade.
 */
export default function RegistrationGridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-black" aria-hidden="true">
      <ShapeGrid
        shape="square"
        direction="none"
        lineColor="#2a2734"
        hoverColor="#ffffff"
        hoverFillColor="#ffffff"
        fillOpacity={0.15}
        cellSize={40}
        speed={0.5}
        tiltX={0}
        tiltY={0}
        rainbow={false}
      />
    </div>
  );
}
