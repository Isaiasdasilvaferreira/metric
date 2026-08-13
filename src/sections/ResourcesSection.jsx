import { resources } from '../data/siteData.js';

function ResourcesSection() {
  return (
    <section className="section resources" id="recursos">
      <div className="math-doodle md-1">12 × 4</div>
      <div className="math-doodle md-2">√49</div>
      <div className="math-doodle md-3">−8 + 13</div>

      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow pink">RECURSOS</span>
          <h2>O que a Metric reúne <span>para as atividades.</span></h2>
          <p>Recursos ligados ao que acontece antes, durante e depois de cada atividade.</p>
        </div>

        <div className="resources-grid">
          {resources.map(({ icon: Icon, title, text }) => (
            <article className="resource-card" key={title}>
              <div className="resource-icon"><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ResourcesSection;
