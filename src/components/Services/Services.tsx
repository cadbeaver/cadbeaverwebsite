import React from 'react';
import { servicesList } from '../../data/servicesData';
import { ServiceCard } from './ServiceCard';

export const Services: React.FC = () => {
  return (
    <section className="section-wrap" id="services">
      <div className="section-header">
        <p
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px'
          }}
        >
          Our Capabilities
        </p>
        <h2 className="section-title">
          Rigorous Engineering, Custom Software &amp; Intelligent Automation
        </h2>
      </div>

      <div className="services-grid">
        {servicesList.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};

