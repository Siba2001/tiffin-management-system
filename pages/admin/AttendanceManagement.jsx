import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { attendanceService, studentService, reportService } from '../../services';
import { handleApiError, showSuccess, formatDate, downloadBlob, getTodayDate } from '../../utils/helpers';

const AttendanceManagement = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ studentId: '', attendanceDate: getTodayDate(), status: 'PRESENT' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, stuRes] = await Promise.all([
        attendanceService.getAll({ page, size: 10 }),
        studentService.getAll({ page: 0, size: 100 }),
      ]);
      setRecords(attRes.data.data.content);
      setTotalPages(attRes.data.data.totalPages);
      setStudents(stuRes.data.data.content);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, studentId: Number(form.studentId) };
      if (editId) await attendanceService.update(editId, payload);
      else await attendanceService.create(payload);
      showSuccess(editId ? 'Attendance updated' : 'Attendance marked');
      setShowModal(false);
      fetchData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await attendanceService.delete(id);
      showSuccess('Deleted');
      fetchData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const exportPdf = async () => {
    try {
      const { data } = await reportService.exportAttendance();
      downloadBlob(data, 'attendance-report.pdf');
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AdminLayout>
      {loading && <LoadingSpinner />}
      <div className="d-flex justify-content-between align-items-center page-header flex-wrap gap-2">
        <div><h4 className="fw-bold mb-1">Attendance Management</h4></div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={exportPdf}><i className="bi bi-file-pdf me-1"></i>Export PDF</button>
          <button className="btn btn-primary" onClick={() => { setEditId(null); setForm({ studentId: '', attendanceDate: getTodayDate(), status: 'PRESENT' }); setShowModal(true); }}>
            <i className="bi bi-plus-lg me-1"></i>Mark Attendance
          </button>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr><th>Student</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.studentName}</td>
                  <td>{formatDate(r.attendanceDate)}</td>
                  <td><span className={`badge bg-${r.status === 'PRESENT' ? 'success' : 'danger'}`}>{r.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => { setEditId(r.id); setForm({ studentId: r.studentId, attendanceDate: r.attendanceDate, status: r.status }); setShowModal(true); }}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page + 1} of {totalPages || 1}</span>
          <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">{editId ? 'Edit' : 'Mark'} Attendance</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button></div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2"><label className="form-label">Student</label>
                    <select className="form-select" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
                      <option value="">Select student</option>
                      {students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                    </select></div>
                  <div className="mb-2"><label className="form-label">Date</label>
                    <input type="date" className="form-control" required value={form.attendanceDate} onChange={(e) => setForm({ ...form, attendanceDate: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="PRESENT">PRESENT</option><option value="ABSENT">ABSENT</option>
                    </select></div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AttendanceManagement;
