import React, { useState } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { Services } from './components/Services/Services';
import { CaseStudies } from './components/CaseStudies/CaseStudies';
import { Footer } from './components/Footer/Footer';
import { ProjectDetailModal } from './components/ProjectModal/ProjectDetailModal';
import { ContactModal } from './components/Contact/ContactModal';
import { projectsMap } from './data/projectsData';
import { ProjectData } from './types';

export const App: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactService, setContactService] = useState('01 — Engineering Design & Development');
  const [contactMessage, setContactMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const handleOpenContact = () => {
    setContactService('01 — Engineering Design & Development');
    setContactMessage('');
    setIsContactOpen(true);
  };

  const handleOpenProject = (projectId: string) => {
    const project = projectsMap[projectId];
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const handleInquireFromProject = (project: ProjectData) => {
    setSelectedProject(null);
    setContactService(project.serviceOption || '01 — Engineering Design & Development');
    setContactMessage(
      `I would like to inquire regarding engineering services similar to "${project.title}" (${project.badge}).\nProject Scope Requirement: `
    );
    setTimeout(() => {
      setIsContactOpen(true);
    }, 280);
  };

  return (
    <>
      <Navbar onOpenContact={handleOpenContact} />

      <main>
        <Hero />
        <Services />
        <CaseStudies onOpenProject={handleOpenProject} />
      </main>

      <Footer onOpenContact={handleOpenContact} />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseProject}
        onInquire={handleInquireFromProject}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialService={contactService}
        initialMessage={contactMessage}
      />
    </>
  );
};

export default App;

