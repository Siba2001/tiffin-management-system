import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/MainLayout';
import DashboardCard from '../../components/DashboardCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { dashboardService, orderService } from '../../services';
import { handleApiError, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, ordersRes] = await Promise.all([
          dashboardService.getAdmin(),
          orderService.getAll({ page: 0, size: 5 }),
        ]);
        setData(dashRes.data.data);
        setRecentOrders(ordersRes.data.data.content);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="page-header">
        <h4 className="fw-bold mb-1">Admin Dashboard</h4>
        <p className="text-muted mb-0">Overview of tiffin management system</p>
      </div>

      <div className="row">
        <DashboardCard title="Total Students" value={data?.totalStudents} icon="bi-people" color="primary" />
        <DashboardCard title="Active Students" value={data?.activeStudents} icon="bi-person-check" color="success" />
        <DashboardCard title="Total Orders" value={data?.totalOrders} icon="bi-bag" color="info" />
        <DashboardCard title="Active Orders" value={data?.activeOrders} icon="bi-bag-check" color="warning" />
        <DashboardCard title="Today's Attendance" value={data?.todayAttendance} icon="bi-calendar-check" color="danger" />
      </div>

      <div className="row mt-3">
        <div className="col-lg-6 mb-3">
          <div className="card table-card">
            <div className="card-header bg-white fw-semibold">Today's Menu</div>
            <div className="card-body">
              {data?.todayMenu ? (
                <>
                  <p><strong>Breakfast:</strong> {data.todayMenu.breakfast || '-'}</p>
                  <p><strong>Lunch:</strong> {data.todayMenu.lunch || '-'}</p>
                  <p className="mb-0"><strong>Dinner:</strong> {data.todayMenu.dinner || '-'}</p>
                </>
              ) : (
                <p className="text-muted mb-0">No menu set for today</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-3">
          <div className="card table-card">
            <div className="card-header bg-white fw-semibold">Recent Orders</div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead><tr><th>Student</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan="3" className="text-muted text-center">No orders yet</td></tr>
                  ) : recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.studentName}</td>
                      <td>{formatDate(o.orderDate)}</td>
                      <td><span className={`badge bg-${o.orderStatus === 'PLACED' ? 'warning' : o.orderStatus === 'COMPLETED' ? 'success' : 'secondary'}`}>{o.orderStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
