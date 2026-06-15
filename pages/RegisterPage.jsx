import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import { handleApiError, showSuccess } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: '', mobileNumber: '', email: '', password: '',
    address: '', aadhaarNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.register(form);
      login(data.data);
      showSuccess('Registration successful!');
      navigate('/student/dashboard');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center p-3">
      {loading && <LoadingSpinner />}
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="card auth-card">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h3 className="fw-bold">Student Registration</h3>
              <p className="text-muted">Create your tiffin account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name *</label>
                  <input name="fullName" className="form-control" required value={form.fullName} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile Number *</label>
                  <input name="mobileNumber" className="form-control" required pattern="[6-9][0-9]{9}"
                    value={form.mobileNumber} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email *</label>
                  <input name="email" type="email" className="form-control" required value={form.email} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Password *</label>
                  <input name="password" type="password" className="form-control" required minLength={8}
                    value={form.password} onChange={handleChange} />
                  <small className="text-muted">Min 8 chars with upper, lower, digit & special char</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Aadhaar Number</label>
                  <input name="aadhaarNumber" className="form-control" pattern="\d{12}" maxLength={12}
                    value={form.aadhaarNumber} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Address</label>
                  <input name="address" className="form-control" value={form.address} onChange={handleChange} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 mt-2">Register</button>
            </form>
            <p className="text-center mt-3 mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
