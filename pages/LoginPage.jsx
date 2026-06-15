import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import { handleApiError, showSuccess } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.login(form);
      login(data.data);
      showSuccess('Login successful!');
      navigate(data.data.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center p-3">
      {loading && <LoadingSpinner />}
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="card auth-card">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <i className="bi bi-cup-hot-fill text-primary" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-2 fw-bold">Tiffin Management</h3>
              <p className="text-muted">Sign in to your account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" required
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" required
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2">Sign In</button>
            </form>
            <p className="text-center mt-3 mb-0">
              New student? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
