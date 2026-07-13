'use client';

import { FC, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const BAR_COUNT = 7;

// A small skeleton "growing bars" loader for the analytics dashboard,
// animated with anime.js — chosen here over motion.dev because anime.js's
// timeline/stagger primitives are a better fit for this kind of
// many-element, loop-forever choreography.
export const AnalyticsLoading: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const bars = containerRef.current.querySelectorAll<HTMLDivElement>(
      '[data-analytics-loading-bar]'
    );

    const animation = animate(bars, {
      scaleY: [0.25, 1],
      opacity: [0.35, 1],
      duration: 700,
      ease: 'inOutSine',
      alternate: true,
      loop: true,
      delay: stagger(90),
    });

    return () => {
      animation?.pause?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-end gap-[6px] h-[64px]"
      role="status"
      aria-label="Loading analytics"
    >
      {Array.from({ length: BAR_COUNT }).map((_, index) => (
        <div
          key={index}
          data-analytics-loading-bar
          className="w-[8px] h-full rounded-[3px] origin-bottom"
          style={{
            backgroundColor: '#612bd3',
            transform: 'scaleY(0.25)',
            opacity: 0.35,
          }}
        />
      ))}
    </div>
  );
};
