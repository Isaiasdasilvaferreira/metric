import { ArrowRight, Delete } from 'lucide-react';

const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '−', '0', ','];

function AppMockup() {
  return (
    <div className="hero-visual" aria-label="Prévia ilustrativa das interfaces da Metric">
      <div className="phone phone--back">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="app-mini-header">
            <span className="mini-logo">M</span>
            <div>
              <small>2º DS</small>
              <span>Multiplicação</span>
            </div>
          </div>

          <div className="exercise-progress">
            <div><span>Questão 08</span><strong>08/12</strong></div>
            <div className="mini-progress"><i style={{ width: '66%' }} /></div>
          </div>

          <div className="mini-question-card">
            <span>Resolva mentalmente</span>
            <strong>12 × 4</strong>
            <div className="answer-display">48</div>
          </div>

          <div className="number-keypad">
            {keypad.map((key) => <button type="button" key={key}>{key}</button>)}
            <button type="button" className="key-delete" aria-label="Apagar"><Delete /></button>
            <button type="button" className="key-next">Próxima <ArrowRight /></button>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-top">
          <div>
            <span className="eyebrow">Visão geral</span>
            <h3>Olá, professora!</h3>
          </div>
          <span className="avatar">M</span>
        </div>

        <div className="stat-grid">
          <div className="stat-card"><span>Turmas</span><strong>4</strong><small>ativas</small></div>
          <div className="stat-card"><span>Alunos</span><strong>87</strong><small>cadastrados</small></div>
          <div className="stat-card"><span>Atividades</span><strong>12</strong><small>criadas</small></div>
        </div>

        <div className="dashboard-section-title"><strong>Ranking da turma</strong><span>2º DS</span></div>
        <div className="ranking-row rank-1"><b>1</b><span>Marina Alves</span><strong>980 pts</strong></div>
        <div className="ranking-row"><b>2</b><span>Lucas Ferreira</span><strong>945 pts</strong></div>
        <div className="ranking-row"><b>3</b><span>Ana Júlia</span><strong>910 pts</strong></div>

        <div className="chart-panel">
          <div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /></div>
          <div><span>Atividades concluídas</span><strong>10/12</strong></div>
        </div>
      </div>
    </div>
  );
}

export default AppMockup;
