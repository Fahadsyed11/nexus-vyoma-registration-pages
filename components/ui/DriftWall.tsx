'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import './DriftWall.css';

export interface DriftWallItem {
  image: string;
  title?: string;
  href?: string;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  blur?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DEFAULT_DRIFT_ITEMS: DriftWallItem[] = [
  {
    image: '/brand/drift-wall/rpm-gear-up.webp',
    title: 'RPM (Gear Up) — Automotive Fest',
  },
  {
    image: '/brand/drift-wall/cipher-hacker-main.webp',
    title: 'Nexus Cipher — Capture The Flag',
  },
  {
    image: '/brand/drift-wall/jashn-e-suroor.webp',
    title: 'Jashn-E-Suroor — Qawwali Night',
  },
  {
    image: '/brand/drift-wall/eclipse-dj-night.webp',
    title: 'Eclipse 404 — Mega DJ Night',
  },
  {
    image: '/brand/drift-wall/charcha-open-mic.webp',
    title: 'Charcha The Talk — Open Mic & Comedy',
  },
  {
    image: '/brand/drift-wall/signal-hunt-main.webp',
    title: 'Signal Hunt — RF Radio Quest',
  },
  {
    image: '/brand/drift-wall/rpm-superbike.webp',
    title: 'RPM Superbike & Stunt Arena',
  },
  {
    image: '/brand/drift-wall/cipher-cyber-skyline.webp',
    title: 'Nexus Cipher — Cyberpunk Grid',
  },
  {
    image: '/brand/drift-wall/jashn-qawwali-stage.webp',
    title: 'Qawwali Live Ensemble Stage',
  },
  {
    image: '/brand/drift-wall/charcha-acoustic-stage.webp',
    title: 'Charcha Acoustic Stage & Jam',
  },
  {
    image: '/brand/drift-wall/rpm-drift-cars.webp',
    title: 'RPM Custom Drift Cars & Performance',
  },
  {
    image: '/brand/drift-wall/eclipse-disco-ball.webp',
    title: 'Eclipse 404 Cosmic Mirrorball',
  },
  {
    image: '/brand/drift-wall/cipher-badges.webp',
    title: 'Web Exploitation & Cryptography',
  },
  {
    image: '/brand/drift-wall/signal-hunt-antenna.webp',
    title: 'Signal Hunt Satellite Tracking',
  },
  {
    image: '/brand/drift-wall/charcha-art-show.webp',
    title: 'Charcha Art Show & Cultural Stage',
  },
  {
    image: '/brand/drift-wall/rpm-speedometer.webp',
    title: 'RPM Tachometer & Drag Challenge',
  },
  {
    image: '/brand/drift-wall/jashn-courtyard-banner.webp',
    title: 'Jashn Grand Stage Banner',
  },
  {
    image: '/brand/drift-wall/nexus-fest-marquee.webp',
    title: 'Nexus Vyoma Official Fest Marquee',
  },
  {
    image: '/brand/drift-wall/charcha-wet-reflections.webp',
    title: 'Charcha Golden Hour Stage Ambiance',
  },
  {
    image: '/brand/drift-wall/nexus-fest-badge.webp',
    title: 'Nexus Vyoma Official Fest Emblem',
  },
];

const DEFAULT_ITEMS: DriftWallItem[] = DEFAULT_DRIFT_ITEMS;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

export default function DriftWall({
  items = DEFAULT_ITEMS,
  columns = 7,
  tileWidth = 200,
  tileHeight = 135,
  gap = 12,
  radius = 12,
  tilt = 10,
  turn = -10,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 50,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,  
  fade = 0.8,
  dim = 0.70,
  blur = 1.5,
  grayscale = false,
  overlayColor = '#060010',
  className = '',
  style,
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight || 600);
        setContainerWidth(containerRef.current.clientWidth || window.innerWidth || 1200);
      }
    };
    updateSize();
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
      setContainerWidth(entry.contentRect.width || 1200);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute responsive parameters based on containerWidth while keeping desktop exact
  const responsiveConfig = useMemo(() => {
    if (containerWidth < 640) {
      return {
        columns: Math.min(columns, 4),
        tileWidth: Math.min(tileWidth, 130),
        tileHeight: Math.min(tileHeight, 88),
        gap: Math.min(gap, 10),
      };
    }
    if (containerWidth < 1024) {
      return {
        columns: Math.min(columns, 5),
        tileWidth: Math.min(tileWidth, 165),
        tileHeight: Math.min(tileHeight, 110),
        gap: Math.min(gap, 12),
      };
    }
    return {
      columns,
      tileWidth,
      tileHeight,
      gap,
    };
  }, [containerWidth, columns, tileWidth, tileHeight, gap]);

  const columnItems = useMemo(() => {
    const colCount = responsiveConfig.columns;
    if (!items.length) return [];

    // Ensure each column has 10 unique events before looping, and NO two columns share the same image in any row
    const itemsPerCol = Math.min(10, items.length);
    const stride = 7; // coprime to 20 for maximum dispersion across the grid
    const cols: DriftWallItem[][] = [];

    for (let c = 0; c < colCount; c++) {
      const colList: DriftWallItem[] = [];
      const start = (c * 9 + 4) % items.length;
      for (let k = 0; k < itemsPerCol; k++) {
        colList.push(items[(start + k * stride) % items.length]);
      }
      cols.push(colList);
    }
    return cols;
  }, [items, responsiveConfig.columns]);

  const columnMeta = useMemo(() => {
    const unit = responsiveConfig.tileHeight + responsiveConfig.gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, responsiveConfig.tileHeight, responsiveConfig.gap, containerHeight]);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => {
      // Golden ratio stagger prevents horizontal grid alignment across adjacent rows
      const stagger = (c * 0.6180339887 + 0.17) % 1;
      return meta.copyHeight * stagger;
    });
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id: string, index: number) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
      if (!tile || !(tile instanceof HTMLElement)) return;
      const id = tile.dataset.tileId;
      if (!id || id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo(
    () =>
    ({
      '--dw-tile-w': `${responsiveConfig.tileWidth}px`,
      '--dw-tile-h': `${responsiveConfig.tileHeight}px`,
      '--dw-gap': `${responsiveConfig.gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-blur': `${blur}px`,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style,
    } as React.CSSProperties),
    [responsiveConfig, radius, perspective, lift, dim, blur, grayscale, overlayColor, fade, style]
  );

  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    const isExternal = item.image.startsWith('http');
    const inner = (
      <span className="drift-wall__inner">
        <Image
          src={item.image}
          alt={item.title ?? ''}
          fill
          unoptimized={isExternal}
          sizes="250px"
          className="object-cover pointer-events-none select-none"
          draggable={false}
        />
        <span className="drift-wall__overlay" aria-hidden="true" />
      </span>
    );

    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
    };

    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    );
  };

  const rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div className="drift-wall__track" ref={(el) => { trackRefs.current[c] = el; }}>
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
