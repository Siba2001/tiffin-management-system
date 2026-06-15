import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { orderService } from '../../services';
import { handleApiError, showSuccess, formatDate, formatDateTime } from '../../utils/helpers';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await orderService.getAll(params);
      setOrders(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const updateStatus = async (id, orderStatus) => {
    try {
      await orderService.updateStatus(id, orderStatus);
      showSuccess('Order status updated');
      fetchOrders();
    } catch (error) {
      handleApiError(error);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await orderService.cancel(id);
      showSuccess('Order cancelled');
      fetchOrders();
    } catch (error) {
      handleApiError(error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await orderService.delete(id);
      showSuccess('Order deleted');
      fetchOrders();
    } catch (error) {
      handleApiError(error);
    }
  };

  const statusColor = (s) => ({ PLACED: 'warning', COMPLETED: 'success', CANCELLED: 'secondary' }[s] || 'secondary');

  return (
    <AdminLayout>
      {loading && <LoadingSpinner />}
      <div className="page-header">
        <h4 className="fw-bold mb-1">Order Management</h4>
      </div>

      <div className="card table-card">
        <div className="card-body">
          <select className="form-select mb-3 w-auto" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
            <option value="">All Status</option>
            <option value="PLACED">PLACED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead><tr>
                <th>ID</th><th>Student</th><th>Menu Date</th><th>Qty</th><th>Amount</th><th>Status</th><th>Order Date</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.studentName}</td>
                    <td>{formatDate(o.menuDate)}</td>
                    <td>{o.quantity}</td>
                    <td>₹{o.totalAmount}</td>
                    <td><span className={`badge bg-${statusColor(o.orderStatus)}`}>{o.orderStatus}</span></td>
                    <td>{formatDateTime(o.orderDate)}</td>
                    <td>
                      {o.orderStatus === 'PLACED' && (
                        <>
                          <button className="btn btn-sm btn-outline-success me-1" onClick={() => updateStatus(o.id, 'COMPLETED')}>Complete</button>
                          <button className="btn btn-sm btn-outline-warning me-1" onClick={() => cancelOrder(o.id)}>Cancel</button>
                        </>
                      )}
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteOrder(o.id)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page + 1} of {totalPages || 1}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;
