import { useEffect, useState } from 'react';
import { StudentLayout } from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { attendanceService } from '../../services';
import { handleApiError, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const StudentAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    attendanceService.getByStudent(user.userId)
      .then((res) => setRecords(res.data.data))
      .catch(handleApiError)
      .finally(() => setLoading(false));
  }, [user.userId]);

  return (
    <StudentLayout>
      {loading && <LoadingSpinner />}
      <div className="page-header">
        <h4 className="fw-bold mb-1">My Attendance</h4>
      </div>
      <div className="card table-card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan="2" className="text-center text-muted">No attendance records</td></tr>
              ) : records.map((r) => (
                <tr key={r.id}>
                  <td>{formatDate(r.attendanceDate)}</td>
                  <td><span className={`badge bg-${r.status === 'PRESENT' ? 'success' : 'danger'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentAttendance;
