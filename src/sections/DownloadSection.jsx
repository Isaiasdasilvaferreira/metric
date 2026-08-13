import { Check, Download, Smartphone } from 'lucide-react';
import DownloadActions from '../components/common/DownloadActions.jsx';

function DownloadSection() {
  return (
    <section className="section download-section" id="download">
      <div className="container download-grid">
        <div className="download-copy">
          <span className="eyebrow pink">APLICATIVO</span>
          <h2>Baixe a Metric <span>no Android.</span></h2>
          <p>Instale a Metric para acessar as atividades pelo celular. A versão para iOS ainda não está disponível.</p>

          <div className="download-points">
            <span><Check /> Atividades no celular</span>
            <span><Check /> Respostas digitadas na tela</span>
            <span><Check /> Acesso aos dados do perfil</span>
          </div>

          <DownloadActions />
        </div>

        <div className="download-visual" aria-hidden="true">
          <div className="download-halo" />
          <div className="download-phone">
            <div className="download-phone-notch" />
            <div className="download-phone-screen">
              <div className="download-app-icon">M</div>
              <strong>Metric</strong>
              <span>Atividades de matemática</span>
              <div className="download-progress"><i /></div>
              <div className="download-ready"><Smartphone /><span><small>Versão</small><b>Android</b></span></div>
            </div>
          </div>
          <div className="download-float-card"><Download /><span><small>Arquivo</small><strong>Metric.apk</strong></span></div>
          <div className="download-equation de-1">(−8) + 13</div>
          <div className="download-equation de-2">√144</div>
          <div className="download-equation de-3">6 × (4 + 2)</div>
        </div>
      </div>
    </section>
  );
}

export default DownloadSection;
