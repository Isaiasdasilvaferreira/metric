import { LockKeyhole, Smartphone } from 'lucide-react';
import { androidDownloadPath } from '../../data/siteData.js';

function DownloadActions({ light = false }) {
  return (
    <div className={`download-actions ${light ? 'download-actions--light' : ''}`}>
      <a className="store-button store-button--android" href={androidDownloadPath} download="Metric.apk">
        <span className="store-icon"><Smartphone /></span>
        <span><small>Disponível para</small><strong>Android</strong></span>
      </a>

      <button className="store-button store-button--ios" type="button" disabled aria-label="Versão para iOS em breve">
        <span className="ios-lock" aria-hidden="true"><LockKeyhole /></span>
        <span><small>iOS</small><strong>Em breve</strong></span>
      </button>
    </div>
  );
}

export default DownloadActions;
