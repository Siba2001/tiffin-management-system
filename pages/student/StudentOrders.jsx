import { useEffect, useState } from 'react';
import { StudentLayout } from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderService, menuService } from '../../services';
import { handleApiError, showSuccess, formatDate, formatDateTime, getTodayDate } from '../../utils/helpers';

const StudentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ menuId: '', quantity: 1 });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderService.getAll({ page: 0, size: 50 });
      setOrders(data.data.content);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    menuService.getWeekly(getTodayDate()).then((res) => setMenus(res.data.data)).catch(handleApiError);
  }, []);

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      await orderService.place({ menuId: Number(form.menuId), quantity: Number(form.quantity) });
      showSuccess('Order placed successfully!');
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      handleApiError(error);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await orderService.cancel(id);
      showSuccess('Order cancelled');
      fetchOrders();
    } catch (error) {
      handleApiError(error);
    }
  };

  const statusColor = (s) => ({ PLACED: 'warning', COMPLETED: 'success', CANCELLED: 'secondary' }[s]);

  return (
    <StudentLayout>
      {loading && <LoadingSpinner />}
      <div className="d-flex justify-content-between align-items-center page-header">
        <div><h4 className="fw-bold mb-1">My Orders</h4></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-1"></i>Place Order
        </button>
      </div>

      <div className="card table-card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr><th>Menu Date</th><th>Quantity</th><th>Amount</th><th>Status</th><th>Order Date</th><th>Actions</th></tr></thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">No orders yet</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id}>
                  <td>{formatDate(o.menuDate)}</td>
                  <td>{o.quantity}</td>
                  <td>₹{o.totalAmount}</td>
                  <td><span className={`badge bg-${statusColor(o.orderStatus)}`}>{o.orderStatus}</span></td>
                  <td>{formatDateTime(o.orderDate)}</td>
                  <td>
                    {o.orderStatus === 'PLACED' && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => cancelOrder(o.id)}>Cancel</button>
                    )}
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
              <div className="modal-header"><h5 className="modal-title">Place Order</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button></div>
              <form onSubmit={placeOrder}>
                <div className="modal-body">
                  <div className="mb-2"><label className="form-label">Select Menu Date</label>
                    <select className="form-select" required value={form.menuId} onChange={(e) => setForm({ ...form, menuId: e.target.value })}>
                      <option value="">Choose menu</option>
                      {menus.map((m) => <option key={m.id} value={m.id}>{formatDate(m.menuDate)} - {m.lunch || 'Menu'}</option>)}
                    </select></div>
                  <div className="mb-2"><label className="form-label">Quantity</label>
                    <input type="number" min="1" className="form-control" required value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
                  <small className="text-muted">Price: ₹50 per meal</small>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Place Order</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentOrders;
