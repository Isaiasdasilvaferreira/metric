import metricLogo from '../../assets/metric-logo.png';

function LogoMark({ small = false }) {
  return (
    <div className={`brand ${small ? 'brand--small' : ''}`}>
      <img src={metricLogo} alt="Logo da Metric" />
      <span>Metric</span>
    </div>
  );
}

export default LogoMark;
