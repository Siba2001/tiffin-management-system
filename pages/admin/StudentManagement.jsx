import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { studentService, reportService } from '../../services';
import { handleApiError, showSuccess, downloadBlob } from '../../utils/helpers';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ fullName: '', mobileNumber: '', email: '', password: '', address: '', aadhaarNumber: '' });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await studentService.getAll({ page, size: 10, search });
      setStudents(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [page, search]);

  const openModal = (student = null) => {
    if (student) {
      setEditId(student.id);
      setForm({ fullName: student.fullName, mobileNumber: student.mobileNumber, email: student.email,
        password: '', address: student.address || '', aadhaarNumber: student.aadhaarNumber || '' });
    } else {
      setEditId(null);
      setForm({ fullName: '', mobileNumber: '', email: '', password: '', address: '', aadhaarNumber: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await studentService.update(editId, form);
        showSuccess('Student updated');
      } else {
        await studentService.create(form);
        showSuccess('Student created');
      }
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await studentService.delete(id);
      showSuccess('Student deleted');
      fetchStudents();
    } catch (error) {
      handleApiError(error);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      if (action === 'activate') await studentService.activate(id);
      else await studentService.deactivate(id);
      showSuccess(`Student ${action}d`);
      fetchStudents();
    } catch (error) {
      handleApiError(error);
    }
  };

  const exportPdf = async () => {
    try {
      const { data } = await reportService.exportStudents();
      downloadBlob(data, 'students-report.pdf');
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AdminLayout>
      {loading && <LoadingSpinner />}
      <div className="d-flex justify-content-between align-items-center page-header flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Student Management</h4>
          <p className="text-muted mb-0">Manage registered students</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={exportPdf}>
            <i className="bi bi-file-pdf me-1"></i>Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <i className="bi bi-plus-lg me-1"></i>Add Student
          </button>
        </div>
      </div>

      <div className="card table-card">
        <div className="card-body">
          <input className="form-control mb-3" placeholder="Search by name, email or mobile..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
          <div className="table-responsive">
            <table className="table table-hover">
              <thead><tr>
                <th>Name</th><th>Email</th><th>Mobile</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.fullName}</td>
                    <td>{s.email}</td>
                    <td>{s.mobileNumber}</td>
                    <td><span className={`badge bg-${s.status === 'ACTIVE' ? 'success' : 'secondary'}`}>{s.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openModal(s)}><i className="bi bi-pencil"></i></button>
                      {s.status === 'ACTIVE'
                        ? <button className="btn btn-sm btn-outline-warning me-1" onClick={() => toggleStatus(s.id, 'deactivate')}><i className="bi bi-pause"></i></button>
                        : <button className="btn btn-sm btn-outline-success me-1" onClick={() => toggleStatus(s.id, 'activate')}><i className="bi bi-play"></i></button>}
                      {s.aadhaarImage && <a className="btn btn-sm btn-outline-info me-1" href={`http://localhost:8080/api/files/${s.aadhaarImage}`} target="_blank" rel="noreferrer"><i className="bi bi-file-earmark"></i></a>}
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page + 1} of {totalPages || 1}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? 'Edit Student' : 'Add Student'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2"><label className="form-label">Full Name</label>
                    <input className="form-control" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Email</label>
                    <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Mobile</label>
                    <input className="form-control" required value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Password {editId && '(leave blank to keep)'}</label>
                    <input type="password" className="form-control" required={!editId} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Aadhaar</label>
                    <input className="form-control" value={form.aadhaarNumber} onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Address</label>
                    <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
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

export default StudentManagement;
