import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentMenu from './pages/student/StudentMenu';
import StudentOrders from './pages/student/StudentOrders';
import StudentAttendance from './pages/student/StudentAttendance';
import ProfilePage from './pages/student/ProfilePage';
import LoadingSpinner from './components/LoadingSpinner';

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="ADMIN"><StudentManagement /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute role="ADMIN"><AttendanceManagement /></ProtectedRoute>} />
          <Route path="/admin/menus" element={<ProtectedRoute role="ADMIN"><MenuManagement /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><OrderManagement /></ProtectedRoute>} />

          <Route path="/student/dashboard" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/menu" element={<ProtectedRoute role="STUDENT"><StudentMenu /></ProtectedRoute>} />
          <Route path="/student/orders" element={<ProtectedRoute role="STUDENT"><StudentOrders /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute role="STUDENT"><StudentAttendance /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="STUDENT"><ProfilePage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
