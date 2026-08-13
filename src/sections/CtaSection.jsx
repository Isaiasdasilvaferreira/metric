import { Mail } from 'lucide-react';
import DownloadActions from '../components/common/DownloadActions.jsx';
import { calculatorKeys, contactEmail } from '../data/siteData.js';

function CtaSection() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-equations"><span>+</span><span>√</span><span>×</span><span>÷</span><span>%</span></div>

          <div className="cta-copy">
            <span className="eyebrow light">METRIC</span>
            <h2>Use a Metric nas atividades de matemática.</h2>
            <p>Crie atividades, resolva operações pelo celular e consulte os resultados de cada turma.</p>
            <div className="cta-actions">
              <DownloadActions light />
              <a className="cta-contact" href={`mailto:${contactEmail}`}><Mail size={17} /> Falar com a equipe</a>
            </div>
          </div>

          <div className="cta-illustration">
            <div className="calc-body">
              <div className="calc-display">56</div>
              <div className="calc-keys">{calculatorKeys.map((key) => <i key={key}>{key}</i>)}</div>
            </div>
            <div className="pencil"><span /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
