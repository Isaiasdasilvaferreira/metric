import LegalModal from '../components/legal/LegalModal.jsx';
import { evaluationContent } from './evaluation.js';

function EvaluationModal({ onClose }) {
  return (
    <LegalModal
      content={evaluationContent.evaluation}
      onClose={onClose}
    />
  );
}

export default EvaluationModal;
