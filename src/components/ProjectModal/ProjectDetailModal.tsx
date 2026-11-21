import React, { useEffect } from 'react';
import { ProjectData } from '../../types';
import { SimulationHUD } from './SimulationHUD';
import { TechPipeline } from './TechPipeline';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { SpecsMatrix } from './SpecsMatrix';

interface ProjectDetailModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
  onInquire: (project: ProjectData) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onInquire
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`project-modal-overlay ${isOpen ? 'active' : ''}`}
      id="projectModal"
      aria-hidden={!isOpen}
      onClick={handleBackdropClick}
    >
      <div className="project-modal-container">
        {/* Modal Header Bar */}
        <div className="pm-header-bar">
          <div className="pm-header-left">
            <span className="pm-category-pill" id="pm-badge">
              {project.badge.toUpperCase()}
            </span>
            <span className="pm-status-indicator">
              <span className="pm-pulse-dot" /> LIVE SIMULATION READY
            </span>
          </div>
          <button
            className="pm-close-btn"
            onClick={onClose}
            aria-label="Close Project Detail"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="pm-scroll-body">
          {/* Project Title & Quick Pitch */}
          <div className="pm-hero-text">
            <h2 className="pm-title" id="pm-title">
              {project.title}
            </h2>
            <p className="pm-subtitle" id="pm-subtitle">
              {project.subtitle}
            </p>
          </div>

          {/* SECTION 1: 4K HIGH-TECH SIMULATION VIEWPORT */}
          <SimulationHUD project={project} />

          {/* SECTION 2: CONCEPT 1 — THE ASSEMBLY & TECH PIPELINE */}
          <TechPipeline pipeline={project.pipeline} />

          {/* SECTION 3: CONCEPT 2 — INTERACTIVE BEFORE VS AFTER SLIDER */}
          <BeforeAfterSlider
            before={project.before}
            after={project.after}
            deltas={project.deltas}
          />

          {/* SECTION 4: CONCEPT 3 — LIVE ENGINEERING SCOPE & SPECS MATRIX */}
          <SpecsMatrix project={project} onInquire={onInquire} />
        </div>
      </div>
    </div>
  );
};

