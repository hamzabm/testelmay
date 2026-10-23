import { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Realisation from '../components/Realisation.jsx';
import Projets from '../components/Projets.jsx';
import Soutenir from '../components/Soutenir.jsx';
import Communaute from '../components/Communaute.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import ProjectSheet from '../components/ProjectSheet.jsx';
import DonFab from '../components/DonFab.jsx';

export default function HomePage() {
  const [activeProject, setActiveProject] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const h = document.documentElement;
      const bar = document.getElementById('progress-bar');
      if (bar) {
        const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.width = pct + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openProject = (id) => setActiveProject(id);
  const closeProject = () => setActiveProject(null);

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <div className="progress-bar" id="progress-bar" />
      <Header scrolled={scrolled} />
      <main id="contenu">
        <Hero />
        <About />
        <Realisation onOpenProject={openProject} />
        <Projets onOpenProject={openProject} />
        <Soutenir />
        <Communaute />
        <Contact />
      </main>
      <Footer />
      <DonFab />
      <ProjectSheet projectId={activeProject} onClose={closeProject} />
    </>
  );
}
