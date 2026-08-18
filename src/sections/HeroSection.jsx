import { ArrowRight, Check, Download } from 'lucide-react';
import MathFloat from '../components/ui/MathFloat.jsx';
import MathMarquee from '../components/ui/MathMarquee.jsx';
import AppMockup from '../components/mockups/AppMockup.jsx';

function HeroSection() {
  const androidDownloadUrl = 'https://github.com/Isaiasdasilvaferreira/metric/releases/download/metric/Metric.-.Alunos.apk';

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
              href={androidDownloadUrl}
              download="Metric.apk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={18} /> Baixar para Android
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
