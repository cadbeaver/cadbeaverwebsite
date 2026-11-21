import React, { useState, useRef } from 'react';

interface CaseStudiesProps {
  onOpenProject: (projectId: string) => void;
}

interface TabContent {
  label: string;
  icon: React.ReactNode;
  desc: string;
  target: string;
  status: string;
}

const softwareTabsData: Record<string, TabContent> = {
  ai: {
    label: 'Gen AI Services',
    icon: (
      <svg className="tab-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
    desc: 'With advanced Generative AI and neural vision models, we help businesses automate mission-critical tasks, improve workflows, and make better decisions—faster.',
    target: 'vision-scanner',
    status: 'Production Verified'
  },
  telemetry: {
    label: 'CRM Development',
    icon: (
      <svg className="tab-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    desc: 'High-frequency machine telemetry dashboards with sub-10ms cycle tracking, MQTT / WebSocket data streaming, and comprehensive shopfloor analytics for live plant monitoring.',
    target: 'telemetry-dashboard',
    status: 'Sub-10ms Real-Time'
  },
  erp: {
    label: 'ERP Development',
    icon: (
      <svg className="tab-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    desc: 'Custom industrial ERP engines, automated inventory pipelines, and enterprise REST/GraphQL APIs connecting hardware shopfloor sensors directly to business management systems.',
    target: 'telemetry-dashboard',
    status: 'Enterprise Scalable'
  }
};

const mechanicalTabsData: Record<string, TabContent> = {
  spm: {
    label: 'SPM & Machine Design',
    icon: (
      <svg className="tab-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </svg>
    ),
    desc: 'From conceptual 3D kinematics to manufacturing-ready assemblies, we engineer robust Special Purpose Machines (SPM), dynamic torque systems, and high-precision automation mechanisms built for heavy-duty industrial cycles.',
    target: 'spm-machine',
    status: 'Turnkey Commissioned'
  },
  fea: {
    label: 'FEA Simulation',
    icon: (
      <svg className="tab-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    desc: 'Comprehensive finite element analysis, non-linear stress distribution, dynamic load verification, and thermal dissipation studies ensuring zero field failure under cyclic industrial loading.',
    target: 'rotary-drive',
    status: '248.6 MPa Peak Verified'
  },
  dxf: {
    label: 'DFM & Laser Cut DXF',
    icon: (
      <svg className="tab-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
    desc: 'Production-ready 2D fabrication drawings, ISO 2768-m GD&T prints, sheet metal flat pattern unfolding, and 1:1 DXF profiles optimized for CNC laser cutting and precision bending.',
    target: 'torque-shaft',
    status: 'ISO 2768-m Tolerancing'
  }
};

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onOpenProject }) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [activeSoftwareTab, setActiveSoftwareTab] = useState<'ai' | 'telemetry' | 'erp'>('ai');
  const [activeMechanicalTab, setActiveMechanicalTab] = useState<'spm' | 'fea' | 'dxf'>('spm');

  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const softwareVideoRef = useRef<HTMLVideoElement>(null);
  const mechanicalVideoRef = useRef<HTMLVideoElement>(null);

  const goToSlide = (idx: number) => {
    setActiveSlide(idx);
    if (sliderTrackRef.current) {
      const cards = sliderTrackRef.current.querySelectorAll<HTMLDivElement>('.case-showcase-card');
      if (cards[idx] && cards[0]) {
        const targetLeft = cards[idx].offsetLeft - cards[0].offsetLeft;
        sliderTrackRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
    }
  };

  const nextSlide = () => {
    goToSlide((activeSlide + 1) % 2);
  };

  const prevSlide = () => {
    goToSlide((activeSlide - 1 + 2) % 2);
  };

  const handleScroll = () => {
    if (sliderTrackRef.current) {
      const cards = sliderTrackRef.current.querySelectorAll<HTMLDivElement>('.case-showcase-card');
      if (cards.length > 1) {
        const step = (cards[1].offsetLeft - cards[0].offsetLeft) || sliderTrackRef.current.clientWidth || 1;
        const idx = Math.min(cards.length - 1, Math.max(0, Math.round(sliderTrackRef.current.scrollLeft / step)));
        if (idx !== activeSlide) {
          setActiveSlide(idx);
        }
      }
    }
  };

  const currentSoftware = softwareTabsData[activeSoftwareTab];
  const currentMechanical = mechanicalTabsData[activeMechanicalTab];

  return (
    <section className="case-studies-section" id="cases">
      <div className="case-section-header">
        <h2 className="case-title-huge">OUR CASES &amp; SOLUTIONS</h2>
        <p className="case-section-sub">
          Real-world deployments across custom enterprise software and high-precision mechanical systems.
        </p>
      </div>

      <div className="case-slider-wrapper">
        <div className="case-slider-controls">
          <div className="case-slider-dots">
            <button
              type="button"
              className={`case-dot ${activeSlide === 0 ? 'active' : ''}`}
              onClick={() => goToSlide(0)}
              aria-label="Precision Mechanical Case"
            />
            <button
              type="button"
              className={`case-dot ${activeSlide === 1 ? 'active' : ''}`}
              onClick={() => goToSlide(1)}
              aria-label="Enterprise Software Case"
            />
          </div>

          <div className="case-slider-arrows">
            <button
              type="button"
              className="case-arrow-btn prev-btn"
              onClick={prevSlide}
              aria-label="Previous Case"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button
              type="button"
              className="case-arrow-btn next-btn"
              onClick={nextSlide}
              aria-label="Next Case"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="case-showcase-container case-slider-track"
          id="case-slider-track"
          ref={sliderTrackRef}
          onScroll={handleScroll}
        >
        {/* SHOWCASE ROW 1: PRECISION MECHANICAL DESIGN & ENGINEERING */}
        <div className="case-showcase-card" id="showcase-mechanical">
          <div className="showcase-info-col">
            <div className="showcase-title-wrap">
              <h3 className="showcase-category-title">Precision Mechanical Design</h3>
              <div className="showcase-title-line"></div>
            </div>

            {/* Subcategory Tabs with Monochrome Black & White Vectors */}
            <div className="showcase-tabs-nav" role="tablist">
              {(Object.keys(mechanicalTabsData) as Array<'spm' | 'fea' | 'dxf'>).map((key) => {
                const item = mechanicalTabsData[key];
                return (
                  <button
                    key={key}
                    type="button"
                    className={`showcase-tab ${activeMechanicalTab === key ? 'active' : ''}`}
                    onClick={() => setActiveMechanicalTab(key)}
                  >
                    <span className="tab-icon">{item.icon}</span>
                    <span className="tab-label">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Description */}
            <p className="showcase-desc">{currentMechanical.desc}</p>

            <div className="showcase-actions">
              <button
                type="button"
                className="btn-showcase-learn"
                onClick={() => onOpenProject(currentMechanical.target)}
              >
                <span>Learn more</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              <span className="showcase-status-indicator">
                <span>{currentMechanical.status}</span>
              </span>
            </div>
          </div>

          {/* Pure Clean Video Viewport (No Window Bar, Continuous Loop, Muted) */}
          <div className="showcase-video-col">
            <div className="showcase-video-wrapper">
              <div className="video-media-stage">
                <video
                  ref={mechanicalVideoRef}
                  className="case-video-element"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src="./mechanical-design.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>
            </div>
          </div>
        </div>

        {/* SHOWCASE ROW 2: ENTERPRISE SOFTWARE DEVELOPMENT */}
        <div className="case-showcase-card" id="showcase-software">
          <div className="showcase-info-col">
            <div className="showcase-title-wrap">
              <h3 className="showcase-category-title">Enterprise Software Development</h3>
              <div className="showcase-title-line"></div>
            </div>

            {/* Subcategory Tabs with Monochrome Black & White Vectors */}
            <div className="showcase-tabs-nav" role="tablist">
              {(Object.keys(softwareTabsData) as Array<'ai' | 'telemetry' | 'erp'>).map((key) => {
                const item = softwareTabsData[key];
                return (
                  <button
                    key={key}
                    type="button"
                    className={`showcase-tab ${activeSoftwareTab === key ? 'active' : ''}`}
                    onClick={() => setActiveSoftwareTab(key)}
                  >
                    <span className="tab-icon">{item.icon}</span>
                    <span className="tab-label">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Description */}
            <p className="showcase-desc">{currentSoftware.desc}</p>

            <div className="showcase-actions">
              <button
                type="button"
                className="btn-showcase-learn"
                onClick={() => onOpenProject(currentSoftware.target)}
              >
                <span>Learn more</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              <span className="showcase-status-indicator">
                <span>{currentSoftware.status}</span>
              </span>
            </div>
          </div>

          {/* Pure Clean Video Viewport (No Window Bar, Continuous Loop, Muted) */}
          <div className="showcase-video-col">
            <div className="showcase-video-wrapper">
              <div className="video-media-stage">
                <video
                  ref={softwareVideoRef}
                  className="case-video-element"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src="./custom-software.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};
