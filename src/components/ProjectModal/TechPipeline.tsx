import React from 'react';
import { PipelineStation } from '../../types';

interface TechPipelineProps {
  pipeline: PipelineStation[];
}

export const TechPipeline: React.FC<TechPipelineProps> = ({ pipeline }) => {
  return (
    <div className="pm-section-block">
      <div className="pm-block-header">
        <div className="pm-block-badge">CONCEPT 01 // DELIVERY WORKFLOW</div>
        <h3 className="pm-block-title">The Assembly &amp; Technology Pipeline</h3>
        <p className="pm-block-desc">
          How this project transitions from algorithmic mathematics to physical manufacturing and
          intelligent digital control.
        </p>
      </div>

      <div className="pm-pipeline-track" id="pm-pipeline-track">
        {pipeline.map((station, idx) => (
          <div key={idx} className="pm-pipeline-station">
            <div className="pm-station-top">
              <span className="pm-station-num">{station.num}</span>
              <span className="pm-station-tag">{station.tag}</span>
            </div>
            <h4 className="pm-station-title">{station.title}</h4>
            <p className="pm-station-desc">{station.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

