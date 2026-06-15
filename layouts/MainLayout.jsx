import Sidebar from './Sidebar';

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { path: '/admin/students', label: 'Students', icon: 'bi-people' },
  { path: '/admin/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
  { path: '/admin/menus', label: 'Menus', icon: 'bi-journal-text' },
  { path: '/admin/orders', label: 'Orders', icon: 'bi-bag-check' },
];

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { path: '/student/menu', label: 'Menu', icon: 'bi-journal-text' },
  { path: '/student/orders', label: 'My Orders', icon: 'bi-bag-check' },
  { path: '/student/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
  { path: '/student/profile', label: 'Profile', icon: 'bi-person' },
];

const AdminLayout = ({ children }) => (
  <div className="d-flex">
    <Sidebar links={adminLinks} />
    <main className="main-content flex-grow-1 p-4">{children}</main>
  </div>
);

const StudentLayout = ({ children }) => (
  <div className="d-flex">
    <Sidebar links={studentLinks} />
    <main className="main-content flex-grow-1 p-4">{children}</main>
  </div>
);

export { AdminLayout, StudentLayout };
