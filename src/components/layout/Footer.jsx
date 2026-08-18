import { useState } from 'react';
import { Download, Mail } from 'lucide-react';
import LogoMark from '../ui/LogoMark.jsx';
import LegalModal from '../legal/LegalModal.jsx';
import { contactEmail } from '../../data/siteData.js';
import { legalContent } from '../../data/legalContent.js';

function Footer() {
  const [activeLegal, setActiveLegal] = useState(null);
  const activeContent = activeLegal ? legalContent[activeLegal] : null;

  return (
    <footer className="footer">
      <div className="footer-decoration" aria-hidden="true">+ &nbsp; × &nbsp; ÷ &nbsp; √ &nbsp; −</div>
      <div className="container footer-grid">
        <div className="footer-brand">
          <LogoMark />
          <p>A Metric organiza atividades de matemática, respostas dos alunos, resultados e ranking por turma.</p>
        </div>

        <div className="footer-column">
          <strong>Navegação</strong>
          <a href="#sobre">A Metric</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
          <a href="#professores">Perfis</a>
        </div>

        <div className="footer-column">
          <strong>Acesso</strong>
          <a href="https://github.com/Isaiasdasilvaferreira/metric/releases/download/metric/Metric.-.Alunos.apk" download="Metric.-.Alunos.apk"><Download size={15} /> Baixar para Android</a>
          <a href={`mailto:${contactEmail}`}><Mail size={15} /> {contactEmail}</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 Metric. Todos os direitos reservados.</span>
        <div className="footer-legal-links">
          <button type="button" onClick={() => setActiveLegal('terms')}>Termos de serviço</button>
          <button type="button" onClick={() => setActiveLegal('privacy')}>Privacidade</button>
          <button type="button" onClick={() => setActiveLegal('evaluation')}>Critérios de Avaliação</button>
        </div>
      </div>

      {activeContent && <LegalModal content={activeContent} onClose={() => setActiveLegal(null)} />}
    </footer>
  );
}

export default Footer;
