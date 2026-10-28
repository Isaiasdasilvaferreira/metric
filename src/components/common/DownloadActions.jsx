import { Download } from 'lucide-react';
import { androidPlayStoreUrl, androidApkUrl } from '../data/siteData.js';

function DownloadActions({ light = false }) {
  return (
    <div className={`download-actions${light ? ' download-actions--light' : ''}`}>
      <a
        className="btn btn--pink btn--large"
        href={androidPlayStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
          <path fill="#00D6FF" d="M5 3.7 26 24 5 44.3c-.6-.5-1-1.4-1-2.6V6.3c0-1.2.4-2.1 1-2.6Z" />
          <path fill="#00F076" d="M5 3.7 31 18.5 26 24 5 3.7Z" />
          <path fill="#FFCE00" d="m31 18.5 10.2 5.7c1.5.9 1.5 2.7 0 3.6L31 33.5 26 24l5-5.5Z" />
          <path fill="#FF3A44" d="M5 44.3 31 33.5 26 24 5 44.3Z" />
        </svg>
        Google Play
      </a>
      <a
        className="btn btn--outline btn--large"
        href={androidApkUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <Download size={18} />
        Download alternativo (APK)
      </a>
    </div>
  );
}

export default DownloadActions;
