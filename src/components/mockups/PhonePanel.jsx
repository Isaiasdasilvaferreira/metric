import { Trophy } from 'lucide-react';

function PhonePanel({ mode }) {
  const teacher = mode === 'teacher';

  return (
    <div className={`role-phone ${teacher ? 'role-phone--teacher' : ''}`}>
      <div className="role-phone-top">
        <span className="mini-logo">M</span>
        <span>{teacher ? 'Professora' : 'Aluno'}</span>
      </div>

      {teacher ? (
        <>
          <div className="role-hero-stat">
            <small>Atividade ativa</small>
            <strong>12 contas</strong>
            <span>Turma 2º DS</span>
          </div>
          <div className="role-grid">
            <span>4<br /><small>turmas</small></span>
            <span>87<br /><small>alunos</small></span>
          </div>
          <div className="role-list"><i /><i /><i /></div>
        </>
      ) : (
        <>
          <div className="student-badge">
            <Trophy size={28} />
            <div><small>Sua posição</small><strong>#04</strong></div>
          </div>
          <div className="student-score">
            <small>Pontuação</small>
            <strong>860</strong>
            <span>Ranking da turma</span>
          </div>
          <div className="role-list"><i /><i /><i /></div>
        </>
      )}
    </div>
  );
}

export default PhonePanel;
