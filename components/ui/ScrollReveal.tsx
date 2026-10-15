'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  highlightClassName?: string;
  renderHighlight?: (term: string, words: React.ReactNode) => React.ReactNode;
  rotationEnd?: string;
  wordAnimationStart?: string;
  wordAnimationEnd?: string;
  scrub?: boolean | number;
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  highlightClassName = 'font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FBB03B] drop-shadow-[0_0_16px_rgba(255,106,0,0.35)]',
  renderHighlight,
  rotationEnd = 'bottom bottom',
  wordAnimationStart = 'top 80%',
  wordAnimationEnd = 'bottom bottom',
  scrub = true,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    let wordIndex = 0;

    return parts
      .flatMap((part, partIdx) => {
        const isHighlight = part.startsWith('**') && part.endsWith('**');
        const content = isHighlight ? part.slice(2, -2) : part;

        const renderedWords = content.split(/(\s+)/).map((word) => {
          if (!word) return null;
          if (word.match(/^\s+$/)) return word;
          const currentIdx = wordIndex++;
          return (
            <span
              className={`word ${isHighlight ? highlightClassName : ''}`.trim()}
              key={currentIdx}
            >
              {word}
            </span>
          );
        });

        if (isHighlight && renderHighlight) {
          return (
            <React.Fragment key={`hl-${partIdx}`}>
              {renderHighlight(content, renderedWords)}
            </React.Fragment>
          );
        }

        return renderedWords;
      })
      .filter(Boolean);
  }, [children, highlightClassName, renderHighlight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 85%',
            end: rotationEnd,
            scrub,
          },
        }
      );

      const wordElements = el.querySelectorAll('.word');

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: wordAnimationStart,
            end: wordAnimationEnd,
            scrub,
          },
        }
      );

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: wordAnimationStart,
              end: wordAnimationEnd,
              scrub,
            },
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationStart,
    wordAnimationEnd,
    blurStrength,
    scrub,
  ]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
}
