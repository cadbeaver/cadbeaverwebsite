import React from 'react';
import { ProjectData } from '../../types';

interface SpecsMatrixProps {
  project: ProjectData;
  onInquire: (project: ProjectData) => void;
}

export const SpecsMatrix: React.FC<SpecsMatrixProps> = ({ project, onInquire }) => {
  const waText = encodeURIComponent(
    `Hi Cadbeaver Engineering, I am interested in consulting regarding your "${project.title}" (${project.badge}) project solution.`
  );
  const waHref = `https://wa.me/919172411202?text=${waText}`;

  return (
    <div className="pm-section-block">
      <div className="pm-block-header">
        <div className="pm-block-badge">CONCEPT 03 // TECHNICAL DOSSIER</div>
        <h3 className="pm-block-title">Engineering Scope &amp; System Specifications</h3>
        <p className="pm-block-desc">
          Certified engineering criteria, material specifications, and physical deliverables included
          with this project package.
        </p>
      </div>

      <div className="pm-specs-grid" id="pm-specs-grid">
        {project.specs.map((sp, idx) => (
          <div key={idx} className="pm-spec-item">
            <span className="pm-spec-label">{sp.label}</span>
            <strong className="pm-spec-val">{sp.val}</strong>
          </div>
        ))}
      </div>

      {/* Bottom Conversion Callout */}
      <div className="pm-action-banner">
        <div className="pm-action-text">
          <h4>Ready to engineer a solution of this caliber for your facility?</h4>
          <p>
            Consult with our lead engineering team. We deliver complete parametric 3D models,
            fabrication drawings, software controllers, and AI vision pipelines.
          </p>
        </div>
        <div className="pm-action-buttons">
          <button className="pm-btn-primary" onClick={() => onInquire(project)}>
            <span>Inquire for Similar Project</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          <a
            id="pm-whatsapp-link"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="pm-btn-whatsapp"
          >
            <svg width="16" height="16" fill="#25D366" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>WhatsApp Tech Lead</span>
          </a>
        </div>
      </div>
    </div>
  );
};

