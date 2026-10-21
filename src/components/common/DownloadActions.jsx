import { LockKeyhole } from 'lucide-react';
import { androidPlayStoreUrl } from '../../data/siteData.js';

function DownloadActions({ light = false }) {
  return (
    <div className={`download-actions ${light ? 'download-actions--light' : ''}`}>
      <a 
        className="store-button store-button--android" 
        href={androidPlayStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir na Google Play Store"
      >
        <span className="store-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <path fill="#00D6FF" d="M5 3.7 27.8 24 5 44.3c-.6-.5-1-1.4-1-2.6V6.3c0-1.2.4-2.1 1-2.6Z" />
            <path fill="#00F076" d="m5 3.7 27.4 15.5L27.8 24 5 3.7Z" />
            <path fill="#FFCE00" d="m32.4 19.2 8.8 5c1.5.9 1.5 2.7 0 3.6l-8.8 5L27.8 24l4.6-4.8Z" />
            <path fill="#FF3A44" d="m5 44.3 27.4-15.5-4.6-4.8L5 44.3Z" />
          </svg>
        </span>
        <span><small>Disponível no</small><strong>Google Play</strong></span>
      </a>

      <button className="store-button store-button--ios" type="button" disabled aria-label="Versão para iOS em breve">
        <span className="ios-lock" aria-hidden="true"><LockKeyhole /></span>
        <span><small>iOS</small><strong>Em breve</strong></span>
      </button>
    </div>
  );
}

export default DownloadActions;
