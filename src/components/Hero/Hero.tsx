import React from 'react';
import { HeroCanvas3D } from './HeroCanvas3D';
import { LiquidGlassCards } from './LiquidGlassCards';

export const Hero: React.FC = () => {
  return (
    <section className="hero-container" id="hero">
      <div className="hero-content-col">
        <h1 className="hero-headline">
          Advanced Engineering,
          <br />
          Digital Systems &amp;
          <br />
          Manufacturing Solutions
        </h1>
        <p className="hero-subtitle">
          From concept to production — Mechanical Design,
          <br />
          Custom Software and AI Automation, all in one place.
        </p>
        <div className="hero-cta-group">
          <div className="hero-actions">
            <a href="#services" className="btn-pill btn-primary">
              <span>Explore Services</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#cases" className="btn-pill btn-secondary">
              <span>View Case Studies</span>
              <span className="play-btn-circle">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#000000" style={{ marginLeft: '1px' }}>
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              </span>
            </a>
          </div>
          <div className="hero-services-pills-row">
            <div className="hero-srv-item">
              <div className="hero-srv-icon-wrap" title="Mechanical Design">
                <svg
                  className="srv-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div className="srv-label">
                <span>Mechanical</span>
                <span>Design</span>
              </div>
            </div>

            <div className="hero-srv-divider" />

            <div className="hero-srv-item">
              <div className="hero-srv-icon-wrap" title="Custom Software">
                <svg
                  className="srv-icon srv-icon-code"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="8 6 2 12 8 18" />
                  <polyline points="16 6 22 12 16 18" />
                  <line x1="14" y1="4" x2="10" y2="20" />
                </svg>
              </div>
              <div className="srv-label">
                <span>Custom</span>
                <span>Software</span>
              </div>
            </div>

            <div className="hero-srv-divider" />

            <div className="hero-srv-item">
              <div className="hero-srv-icon-wrap" title="AI Automation">
                <svg
                  className="srv-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="14" x2="23" y2="14" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="14" x2="4" y2="14" />
                </svg>
              </div>
              <div className="srv-label">
                <span>AI</span>
                <span>Automation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-canvas-wrap">
        <HeroCanvas3D />
        <LiquidGlassCards />
      </div>

      <div className="hero-stats-bar">
        <div className="audio-stat-pill">
          <div className="sound-bars">
            <div className="sound-bar" />
            <div className="sound-bar" />
            <div className="sound-bar" />
            <div className="sound-bar" />
            <div className="sound-bar" />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Engineering Metric
            </p>
            <p style={{ fontSize: '14px', fontWeight: 700 }}>Verified Calculations</p>
          </div>
        </div>
      </div>
    </section>
  );
};
