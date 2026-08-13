import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import HeroSection from './sections/HeroSection.jsx';
import AboutSection from './sections/AboutSection.jsx';
import ProcessSection from './sections/ProcessSection.jsx';
import ResourcesSection from './sections/ResourcesSection.jsx';
import RolesSection from './sections/RolesSection.jsx';
import DownloadSection from './sections/DownloadSection.jsx';
import CtaSection from './sections/CtaSection.jsx';

function App() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProcessSection />
        <ResourcesSection />
        <RolesSection />
        <DownloadSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
