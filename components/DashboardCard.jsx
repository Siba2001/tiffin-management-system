const DashboardCard = ({ title, value, icon, color, subtitle }) => (
  <div className="col-md-6 col-lg-4 col-xl-3 mb-3">
    <div className="card dashboard-card h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`icon bg-${color} bg-opacity-10 text-${color}`}>
          <i className={`bi ${icon}`}></i>
        </div>
        <div>
          <p className="text-muted mb-0 small">{title}</p>
          <h4 className="mb-0 fw-bold">{value ?? 0}</h4>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardCard;
