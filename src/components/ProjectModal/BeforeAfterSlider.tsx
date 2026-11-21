import React, { useState, useRef, useCallback } from 'react';
import { BeforeAfterContent, DeltaMetric } from '../../types';

interface BeforeAfterSliderProps {
  before: BeforeAfterContent;
  after: BeforeAfterContent;
  deltas: DeltaMetric[];
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after, deltas }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const updatePosFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(5, Math.min(95, percent));
    setSliderPos(clamped);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    updatePosFromClientX(e.clientX);

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDraggingRef.current) return;
      updatePosFromClientX(ev.clientX);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    if (e.touches[0]) updatePosFromClientX(e.touches[0].clientX);

    const onTouchMove = (ev: TouchEvent) => {
      if (!isDraggingRef.current || !ev.touches[0]) return;
      updatePosFromClientX(ev.touches[0].clientX);
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
  };

  return (
    <div className="pm-section-block">
      <div className="pm-block-header">
        <div className="pm-block-badge">CONCEPT 02 // PERFORMANCE BENCHMARK</div>
        <h3 className="pm-block-title">
          Legacy Traditional Method vs Cadbeaver Engineered Solution
        </h3>
        <p className="pm-block-desc">
          Drag the interactive slider to compare conventional workshop trial-and-error versus
          Cadbeaver parametric precision.
        </p>
      </div>

      <div
        className="pm-ba-container"
        id="pmBaContainer"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: 'ew-resize' }}
      >
        {/* BEFORE PANEL (Underneath / Background) */}
        <div className="pm-ba-panel pm-ba-before" id="pmBaBefore">
          <div className="pm-ba-pill pill-before">LEGACY / UNOPTIMIZED METHOD</div>
          <div className="pm-ba-content">
            <h4 id="pm-before-title">{before.title}</h4>
            <p id="pm-before-desc">{before.desc}</p>
            <div className="pm-ba-tags" id="pm-before-tags">
              {before.tags.map((t) => (
                <span key={t} className="pm-ba-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AFTER PANEL (Clipped overlay) */}
        <div
          className="pm-ba-panel pm-ba-after"
          id="pmBaAfter"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <div className="pm-ba-pill pill-after">CADBEAVER ENGINEERED SYSTEM</div>
          <div className="pm-ba-content">
            <h4 id="pm-after-title">{after.title}</h4>
            <p id="pm-after-desc">{after.desc}</p>
            <div className="pm-ba-tags" id="pm-after-tags">
              {after.tags.map((t) => (
                <span key={t} className="pm-ba-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DRAG HANDLE BAR */}
        <div
          className="pm-ba-handle"
          id="pmBaHandle"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="pm-ba-handle-line" />
          <div className="pm-ba-handle-button" title="Drag to compare">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: '-8px' }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="pm-ba-handle-line" />
        </div>
      </div>

      {/* Delta Metric Summary Cards */}
      <div className="pm-delta-row" id="pm-delta-row">
        {deltas.map((d, idx) => (
          <div key={idx} className="pm-delta-card">
            <div className="pm-delta-val">{d.val}</div>
            <div className="pm-delta-lbl">{d.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

