import React from 'react';
import { ProjectData } from '../../types';

interface ProjectCardProps {
  project: ProjectData;
  onOpen: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const renderPreviewSvg = () => {
    switch (project.id) {
      case 'rotary-drive':
        return (
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#6B7280" strokeWidth="2">
            <circle cx="50" cy="50" r="35" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="15" />
            <path d="M50 15 L50 35 M50 65 L50 85 M15 50 L35 50 M65 50 L85 50" />
          </svg>
        );
      case 'bulk-conveyor':
        return (
          <svg width="140" height="80" viewBox="0 0 140 80" fill="none" stroke="#6B7280" strokeWidth="2">
            <rect x="10" y="20" width="120" height="40" rx="20" />
            <circle cx="30" cy="40" r="12" />
            <circle cx="110" cy="40" r="12" />
            <line x1="30" y1="28" x2="110" y2="28" />
            <line x1="30" y1="52" x2="110" y2="52" />
          </svg>
        );
      case 'spm-machine':
        return (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#6B7280" strokeWidth="2">
            <polygon points="50,15 90,80 10,80" />
            <circle cx="50" cy="55" r="12" />
          </svg>
        );
      case 'torque-shaft':
        return (
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#6B7280" strokeWidth="2">
            <rect x="25" y="25" width="50" height="50" rx="8" />
            <line x1="25" y1="50" x2="75" y2="50" />
            <line x1="50" y1="25" x2="50" y2="75" />
          </svg>
        );
      case 'telemetry-dashboard':
        return (
          <svg width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="#4B5563" strokeWidth="1.8">
            <rect x="12" y="12" width="96" height="66" rx="8" stroke="#1F2937" fill="rgba(255,255,255,0.6)" />
            <line x1="12" y1="26" x2="108" y2="26" stroke="#D1D5DB" />
            <circle cx="22" cy="19" r="2.5" fill="#111827" />
            <circle cx="30" cy="19" r="2.5" fill="#6B7280" />
            <circle cx="38" cy="19" r="2.5" fill="#D1D5DB" />
            <rect x="20" y="34" width="36" height="18" rx="4" stroke="#9CA3AF" fill="rgba(0,0,0,0.02)" />
            <path d="M 24 45 L 32 39 L 40 42 L 52 36" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="62" y="34" width="36" height="18" rx="4" stroke="#9CA3AF" fill="rgba(0,0,0,0.02)" />
            <rect x="68" y="44" width="4.5" height="5" fill="#111827" />
            <rect x="76" y="41" width="4.5" height="8" fill="#4B5563" />
            <rect x="84" y="38" width="4.5" height="11" fill="#9CA3AF" />
            <line x1="20" y1="62" x2="100" y2="62" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="62" x2="72" y2="62" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'vision-scanner':
        return (
          <svg width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="#4B5563" strokeWidth="1.8">
            <rect x="15" y="14" width="90" height="62" rx="8" stroke="#1F2937" fill="rgba(255,255,255,0.6)" />
            <path d="M 15 28 L 24 28 M 15 62 L 24 62 M 105 28 L 96 28 M 105 62 L 96 62" stroke="#9CA3AF" />
            <path d="M 28 14 L 28 23 M 92 14 L 92 23 M 28 76 L 28 67 M 92 76 L 92 67" stroke="#9CA3AF" />
            <rect x="36" y="26" width="48" height="36" rx="4" stroke="#111827" strokeWidth="1.8" strokeDasharray="3 2" />
            <circle cx="60" cy="44" r="9" stroke="#374151" />
            <path d="M 51 44 L 69 44 M 60 35 L 60 53" stroke="#9CA3AF" strokeWidth="1.2" />
            <rect x="36" y="21" width="26" height="8" rx="2" fill="#111827" />
            <text x="49" y="27" fontSize="5" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
              PASS 99.8%
            </text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="project-card"
      onClick={() => onOpen(project.id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="project-canvas-preview">
        {renderPreviewSvg()}
      </div>
      <div>
        <h4>{project.title}</h4>
        <p>{project.subtitle}</p>
        <div className="project-inspect-tag">
          <span>Inspect Case Dossier</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>
    </div>
  );
};

