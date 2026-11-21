import React, { useState, useEffect } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialMessage?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialService = '01 — Engineering Design & Development',
  initialMessage = ''
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [service, setService] = useState(initialService);
  const [msg, setMsg] = useState(initialMessage);

  useEffect(() => {
    if (initialService) setService(initialService);
  }, [initialService]);

  useEffect(() => {
    if (initialMessage) setMsg(initialMessage);
  }, [initialMessage]);

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

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Engineering Inquiry: ${service} - ${name}`);
    const body = encodeURIComponent(
      `Hi Cadbeaver Team,\n\n` +
        `New consultation/quote request:\n` +
        `• Name/Company: ${name}\n` +
        `• Contact Info: ${contact}\n` +
        `• Selected Service: ${service}\n\n` +
        `Details / Scope:\n${msg}\n\n` +
        `Regards,\n${name}`
    );

    window.location.href = `mailto:cadbeaverofficial@gmail.com?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      id="contactModal"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <h3 className="modal-title">Get a Quote / Contact Details</h3>
        <p className="modal-subtitle">
          Direct channels &amp; quick inquiry form for mechanical, software, or AI automation
          requirements.
        </p>

        <div className="modal-direct-channels">
          <a href="tel:+919172411202" className="channel-box">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Call: +91 9172411202</span>
          </a>
          <a
            href="https://wa.me/919172411202?text=Hello%20Cadbeaver,%20I%20want%20to%20request%20a%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="channel-box"
          >
            <svg width="16" height="16" fill="#25D366" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>WhatsApp Chat</span>
          </a>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name / Company</label>
            <input
              type="text"
              id="custName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name or Company"
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Email / Phone</label>
            <input
              type="text"
              id="custContact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="email@example.com or Phone"
              required
            />
          </div>
          <div className="form-group">
            <label>Service Category</label>
            <select
              id="custService"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="01 — Engineering Design & Development">
                01 — Engineering Design &amp; Development
              </option>
              <option value="02 — Digital Modeling & Technical Drafting">
                02 — Digital Modeling &amp; Technical Drafting
              </option>
              <option value="03 — Engineering & Technical Services">
                03 — Engineering &amp; Technical Services
              </option>
              <option value="04 — Manufacturing & Production Support">
                04 — Manufacturing &amp; Production Support
              </option>
              <option value="05 — Material Handling & Industrial Equipment">
                05 — Material Handling &amp; Industrial Equipment
              </option>
              <option value="06 — Custom Engineering Solutions">
                06 — Custom Engineering Solutions
              </option>
              <option value="07 — Custom Industrial Software & Dashboards">
                07 — Custom Industrial Software &amp; Dashboards
              </option>
              <option value="08 — AI Automation & Intelligent Systems">
                08 — AI Automation &amp; Intelligent Systems
              </option>
              <option value="09 — Full Turnkey Engineering (Mechanical + AI/Software)">
                09 — Full Turnkey Engineering (Mechanical + AI/Software)
              </option>
            </select>
          </div>
          <div className="form-group">
            <label>Inquiry Message</label>
            <textarea
              id="custMsg"
              rows={3}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Briefly describe your requirements..."
              required
            />
          </div>
          <button type="submit" className="form-submit-btn">
            Send Inquiry directly to cadbeaverofficial@gmail.com
          </button>
        </form>
      </div>
    </div>
  );
};

