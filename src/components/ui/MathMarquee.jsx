import { equations } from '../../data/siteData.js';

function EquationGroup({ hidden = false }) {
  return (
    <div className="equation-group" aria-hidden={hidden || undefined}>
      {equations.map((equation) => (
        <span key={`${hidden ? 'copy-' : ''}${equation}`}>{equation}</span>
      ))}
    </div>
  );
}

function MathMarquee() {
  return (
    <div className="equation-marquee" aria-label="Exemplos de contas matemáticas">
      <div className="equation-track">
        <EquationGroup />
        <EquationGroup hidden />
      </div>
    </div>
  );
}

export default MathMarquee;
