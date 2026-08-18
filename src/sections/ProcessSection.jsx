import { ChevronRight } from 'lucide-react';
import { steps } from '../data/siteData.js';

function ProcessSection() {
  return (
    <section className="section process" id="como-funciona">
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow pink">COMO FUNCIONA</span>
          <h2>Uma atividade acontece <span>em três etapas.</span></h2>
          <p>Da criação das operações até a consulta dos resultados da turma.</p>
        </div>

        <div className="steps-grid">
          {steps.map(({ number, icon: Icon, title, text }, index) => (
            <article className="step-card" key={title}>
              <div className="step-number">{number}</div>
              <div className="step-icon"><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              {index < steps.length - 1 && <div className="step-arrow"><ChevronRight /></div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
