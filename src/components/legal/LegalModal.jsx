import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X } from 'lucide-react';

function LegalModal({ content, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="legal-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="legal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="legal-modal-header">
          <div className="legal-modal-heading">
            <span className="legal-modal-icon"><ShieldCheck /></span>
            <div>
              <span>{content.label}</span>
              <h2 id="legal-modal-title">{content.title}</h2>
              <small>Última atualização: {content.updatedAt}</small>
            </div>
          </div>
          <button type="button" className="legal-modal-close" onClick={onClose} aria-label="Fechar modal">
            <X />
          </button>
        </div>

        <div className="legal-modal-body">
          <p className="legal-modal-intro">{content.intro}</p>
          {content.sections.map((section) => (
            <article className="legal-modal-section" key={section.title}>
              <h3>{section.title}</h3>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </article>
          ))}
        </div>

        <div className="legal-modal-footer">
          <a href="mailto:nwarelink.ofc@gmail.com">nwarelink.ofc@gmail.com</a>
          <button type="button" onClick={onClose}>Entendi</button>
        </div>
      </section>
    </div>,
    document.body
  );
}

export default LegalModal;
