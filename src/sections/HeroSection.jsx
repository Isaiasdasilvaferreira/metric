import { ArrowRight, Check } from 'lucide-react';
import MathFloat from '../components/ui/MathFloat.jsx';
import MathMarquee from '../components/ui/MathMarquee.jsx';
import AppMockup from '../components/mockups/AppMockup.jsx';
import { androidPlayStoreUrl } from '../data/siteData.js';

function HeroSection() {
  return (
    <section className="hero" id="inicio">
      <div className="grid-bg" />
      <MathFloat className="mf-1">+</MathFloat>
      <MathFloat className="mf-2">÷</MathFloat>
      <MathFloat className="mf-3">√</MathFloat>
      <MathFloat className="mf-4">x²</MathFloat>
      <MathFloat className="mf-5">π</MathFloat>
      <MathFloat className="mf-6">%</MathFloat>

      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>Contas na tela. <span>Respostas direto no aplicativo.</span></h1>
          <p>A Metric permite que a professora prepare atividades e que os alunos resolvam cada operação pelo celular, digitando a resposta e avançando questão por questão.</p>

          <div className="hero-cta-row">
            <a 
              className="btn btn--pink btn--large" 
              href={androidPlayStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
                <path fill="#00D6FF" d="M5 3.7 26 24 5 44.3c-.6-.5-1-1.4-1-2.6V6.3c0-1.2.4-2.1 1-2.6Z" />
                <path fill="#00F076" d="M5 3.7 31 18.5 26 24 5 3.7Z" />
                <path fill="#FFCE00" d="m31 18.5 10.2 5.7c1.5.9 1.5 2.7 0 3.6L31 33.5 26 24l5-5.5Z" />
                <path fill="#FF3A44" d="M5 44.3 31 33.5 26 24 5 44.3Z" />
              </svg>
              Google Play
            </a>
            <a className="btn btn--soft btn--large" href="#como-funciona">
              Ver como funciona <ArrowRight size={18} />
            </a>
          </div>

          <div className="hero-chips">
            <span><Check /> Cálculo mental</span>
            <span><Check /> Resposta pelo teclado</span>
            <span><Check /> Ranking por turma</span>
          </div>
        </div>

        <AppMockup />
      </div>

      <MathMarquee />
    </section>
  );
}

export default HeroSection;
