import React, { useState, useEffect, useRef } from 'react';

const STAT_SLIDES = [
  { label: 'MANUFACTURING EFFICIENCY', value: '98.4%' },
  { label: 'READY FOR PRODUCTION', value: '100%' },
  { label: 'ZERO ERROR FLOW', value: 'DFM' }
];

export const DynamicStatBadge: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animClass, setAnimClass] = useState<'slide-out' | 'slide-in-prep' | ''>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimClass('slide-out');

      timeoutRef.current = setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % STAT_SLIDES.length);
        setAnimClass('slide-in-prep');

        // Allow browser reflow
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimClass('');
          });
        });
      }, 320);
    }, 2800);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const current = STAT_SLIDES[currentIdx];

  return (
    <div className={`revenue-card-float card-stat-corner ${animClass}`}>
      <div className="label" id="dynamic-stat-label">{current.label}</div>
      <div className="value" id="dynamic-stat">
        {current.value}{' '}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </div>
  );
};
