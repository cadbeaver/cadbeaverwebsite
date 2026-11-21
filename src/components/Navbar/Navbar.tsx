import React from 'react';

interface NavbarProps {
    onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
    return (
        <nav>
            <div className="brand">
                <img src="./logo-beaver.png" alt="cadbeaver logo" className="brand-logo-img" />
                <span>cadbeaver</span>
            </div>
            <div className="nav-links">
                <a href="#hero">Overview</a>
                <a href="#services">Capabilities</a>
                <a href="#cases">Our Cases</a>
                <a href="#contact">Contact</a>
            </div>
            <button className="nav-action-btn" onClick={onOpenContact}>
                <span>Get a Quote</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </button>
        </nav>
    );
};

