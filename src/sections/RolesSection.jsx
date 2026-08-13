import { Check, GraduationCap, School } from 'lucide-react';
import PhonePanel from '../components/mockups/PhonePanel.jsx';
import { studentFeatures, teacherFeatures } from '../data/siteData.js';

function RolesSection() {
  return (
    <section className="section roles" id="professores">
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow pink">PERFIS</span>
          <h2>Uma área para a professora. <span>Outra para o aluno.</span></h2>
          <p>Cada perfil mostra apenas as ferramentas necessárias para sua parte na atividade.</p>
        </div>

        <div className="roles-grid">
          <article className="role-card teacher-card">
            <div className="role-copy">
              <div className="role-label"><School /> Professora</div>
              <h3>Crie a atividade e acompanhe a turma.</h3>
              <p>A área da professora concentra a organização das atividades, das turmas e dos resultados.</p>
              <ul>{teacherFeatures.map((item) => <li key={item}><Check /> {item}</li>)}</ul>
            </div>
            <PhonePanel mode="teacher" />
          </article>

          <article className="role-card student-card">
            <div className="role-copy">
              <div className="role-label"><GraduationCap /> Aluno</div>
              <h3>Resolva as contas e avance uma por vez.</h3>
              <p>A área do aluno mostra a operação, recebe a resposta digitada e permite seguir para a próxima questão.</p>
              <ul>{studentFeatures.map((item) => <li key={item}><Check /> {item}</li>)}</ul>
            </div>
            <PhonePanel mode="student" />
          </article>
        </div>
      </div>
    </section>
  );
}

export default RolesSection;
