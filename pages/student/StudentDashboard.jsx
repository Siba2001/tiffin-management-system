import { useEffect, useState } from 'react';
import { StudentLayout } from '../../layouts/MainLayout';
import DashboardCard from '../../components/DashboardCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { dashboardService } from '../../services';
import { handleApiError } from '../../utils/helpers';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStudent()
      .then((res) => setData(res.data.data))
      .catch(handleApiError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <StudentLayout><LoadingSpinner /></StudentLayout>;

  return (
    <StudentLayout>
      <div className="page-header">
        <h4 className="fw-bold mb-1">Student Dashboard</h4>
        <p className="text-muted mb-0">Welcome to your tiffin portal</p>
      </div>

      <div className="row">
        <DashboardCard title="Total Orders" value={data?.totalOrders} icon="bi-bag" color="primary" />
        <DashboardCard title="Active Orders" value={data?.activeOrders} icon="bi-bag-check" color="warning" />
        <DashboardCard title="Attendance Count" value={data?.attendanceCount} icon="bi-calendar-check" color="success" />
      </div>

      <div className="card table-card mt-3">
        <div className="card-header bg-white fw-semibold">Today's Menu</div>
        <div className="card-body">
          {data?.todayMenu ? (
            <div className="row">
              <div className="col-md-4"><strong>Breakfast:</strong><br />{data.todayMenu.breakfast || '-'}</div>
              <div className="col-md-4"><strong>Lunch:</strong><br />{data.todayMenu.lunch || '-'}</div>
              <div className="col-md-4"><strong>Dinner:</strong><br />{data.todayMenu.dinner || '-'}</div>
            </div>
          ) : (
            <p className="text-muted mb-0">No menu available for today</p>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
