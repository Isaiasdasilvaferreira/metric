import { Calculator, Check, Target, Trophy } from 'lucide-react';

function AboutSection() {
  return (
    <section className="section about" id="sobre">
      <div className="container about-grid">
        <div className="section-copy">
          <span className="eyebrow pink">A METRIC</span>
          <h2>Atividades, turmas e resultados <span>em um mesmo fluxo.</span></h2>
          <p>A Metric foi criada para organizar atividades de matemática sem complicar a rotina da professora nem a experiência do aluno.</p>
          <p>Quem ensina prepara as operações e acompanha os resultados. Quem aprende vê uma conta por vez, informa a resposta e segue para a próxima questão.</p>

          <div className="mini-metrics">
            <div><Trophy /><strong>Ranking</strong><span>Posições por turma</span></div>
            <div><Calculator /><strong>Atividades</strong><span>Operações organizadas</span></div>
            <div><Target /><strong>Resultados</strong><span>Dados da atividade</span></div>
          </div>
        </div>

        <div className="about-visual">
          <div className="notebook-paper">
            <span className="paper-hole ph1" /><span className="paper-hole ph2" /><span className="paper-hole ph3" />
            <p>ATIVIDADE #07</p>
            <h3>Multiplicação</h3>
            <div className="paper-equation">18 × 6 = <span>108</span></div>
            <div className="paper-line" /><div className="paper-line short" />
            <div className="teacher-note">Resposta enviada</div>
          </div>
          <div className="floating-card fc-score"><Trophy /><span>4º no ranking</span></div>
          <div className="floating-card fc-correct"><Check /><span>Questão concluída</span></div>
          <div className="pink-orbit orbit-1" /><div className="pink-orbit orbit-2" />
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
