import React from 'react';
import { ServiceData } from '../../types';
import { AntigravityJellyCanvas } from './AntigravityJellyCanvas';
import { DynamicStatBadge } from '../Hero/DynamicStatBadge';

interface ServiceCardProps {
  service: ServiceData;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const colClass = `card-col-${service.colSpan}`;
  const darkClass = service.isDark ? 'card-dark' : '';
  const cardClasses = `service-card ${colClass} ${darkClass}`.trim();

  if (service.hasJellyCanvas) {
    return (
      <div className={cardClasses} id={service.id}>
        <AntigravityJellyCanvas />
        <div className="card-content-wrap">
          <div className="service-number">{service.number}</div>
          <h3 className="service-name">{service.name}</h3>
          <p className="service-desc">{service.desc}</p>
        </div>
        <div className="service-tags card-content-wrap">
          {service.tags.map((tag) => (
            <span key={tag} className="service-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses} id={service.id}>
      {service.id === 'service-04' && <DynamicStatBadge />}
      <div>
        <div className="service-number">{service.number}</div>
        <h3 className="service-name">{service.name}</h3>
        <p className="service-desc">{service.desc}</p>
      </div>
      <div className="service-tags">
        {service.tags.map((tag) => (
          <span key={tag} className="service-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

