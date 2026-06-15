import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { menuService } from '../../services';
import { handleApiError, showSuccess, formatDate, getTodayDate } from '../../utils/helpers';

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ menuDate: getTodayDate(), breakfast: '', lunch: '', dinner: '' });

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const { data } = await menuService.getAll();
      setMenus(data.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenus(); }, []);

  const openModal = (menu = null) => {
    if (menu) {
      setEditId(menu.id);
      setForm({ menuDate: menu.menuDate, breakfast: menu.breakfast || '', lunch: menu.lunch || '', dinner: menu.dinner || '' });
    } else {
      setEditId(null);
      setForm({ menuDate: getTodayDate(), breakfast: '', lunch: '', dinner: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await menuService.update(editId, form);
      else await menuService.create(form);
      showSuccess(editId ? 'Menu updated' : 'Menu created');
      setShowModal(false);
      fetchMenus();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu?')) return;
    try {
      await menuService.delete(id);
      showSuccess('Menu deleted');
      fetchMenus();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AdminLayout>
      {loading && <LoadingSpinner />}
      <div className="d-flex justify-content-between align-items-center page-header">
        <div><h4 className="fw-bold mb-1">Menu Management</h4></div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-1"></i>Add Menu
        </button>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr><th>Date</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Actions</th></tr></thead>
            <tbody>
              {menus.map((m) => (
                <tr key={m.id}>
                  <td>{formatDate(m.menuDate)}</td>
                  <td>{m.breakfast || '-'}</td>
                  <td>{m.lunch || '-'}</td>
                  <td>{m.dinner || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openModal(m)}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">{editId ? 'Edit Menu' : 'Add Menu'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button></div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-2"><label className="form-label">Date</label>
                    <input type="date" className="form-control" required value={form.menuDate} onChange={(e) => setForm({ ...form, menuDate: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Breakfast</label>
                    <textarea className="form-control" rows={2} value={form.breakfast} onChange={(e) => setForm({ ...form, breakfast: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Lunch</label>
                    <textarea className="form-control" rows={2} value={form.lunch} onChange={(e) => setForm({ ...form, lunch: e.target.value })} /></div>
                  <div className="mb-2"><label className="form-label">Dinner</label>
                    <textarea className="form-control" rows={2} value={form.dinner} onChange={(e) => setForm({ ...form, dinner: e.target.value })} /></div>
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

export default MenuManagement;
