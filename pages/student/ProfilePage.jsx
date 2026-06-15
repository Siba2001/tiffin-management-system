import { useEffect, useState } from 'react';
import { StudentLayout } from '../../layouts/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { studentService } from '../../services';
import { handleApiError, showSuccess } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    studentService.getProfile()
      .then((res) => {
        setProfile(res.data.data);
        setForm({
          fullName: res.data.data.fullName,
          mobileNumber: res.data.data.mobileNumber,
          email: res.data.data.email,
          address: res.data.data.address || '',
          aadhaarNumber: res.data.data.aadhaarNumber || '',
          password: '',
        });
      })
      .catch(handleApiError)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await studentService.updateProfile(form);
      setProfile(data.data);
      showSuccess('Profile updated');
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAadhaarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await studentService.uploadAadhaar(user.userId, file);
      setProfile(data.data);
      showSuccess('Aadhaar uploaded');
    } catch (error) {
      handleApiError(error);
    }
  };

  if (loading) return <StudentLayout><LoadingSpinner /></StudentLayout>;

  return (
    <StudentLayout>
      {saving && <LoadingSpinner />}
      <div className="page-header">
        <h4 className="fw-bold mb-1">My Profile</h4>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card table-card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" required value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile</label>
                    <input className="form-control" required value={form.mobileNumber}
                      onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Aadhaar Number</label>
                    <input className="form-control" value={form.aadhaarNumber}
                      onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })} />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Address</label>
                    <input className="form-control" value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">New Password (optional)</label>
                    <input type="password" className="form-control" value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card table-card">
            <div className="card-header bg-white fw-semibold">Aadhaar Document</div>
            <div className="card-body text-center">
              {profile?.aadhaarImage ? (
                <a href={`http://localhost:8080/api/files/${profile.aadhaarImage}`} target="_blank" rel="noreferrer"
                  className="btn btn-outline-primary mb-3">
                  <i className="bi bi-file-earmark me-1"></i>View Document
                </a>
              ) : (
                <p className="text-muted">No document uploaded</p>
              )}
              <input type="file" className="form-control" accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleAadhaarUpload} />
              <small className="text-muted d-block mt-2">JPG, PNG or PDF (max 5MB)</small>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default ProfilePage;
