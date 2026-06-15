import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ links }) => {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <button className="btn btn-dark d-md-none position-fixed top-0 start-0 m-2 z-3"
        onClick={() => setShow(!show)}>
        <i className="bi bi-list"></i>
      </button>
      <aside className={`sidebar ${show ? 'show' : ''}`}>
        <div className="p-4 border-bottom border-secondary">
          <h5 className="text-white mb-0">
            <i className="bi bi-cup-hot-fill text-warning me-2"></i>
            Tiffin MS
          </h5>
          <small className="text-secondary">{user?.fullName}</small>
        </div>
        <nav className="nav flex-column py-3">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setShow(false)}>
              <i className={`bi ${link.icon} me-2`}></i>{link.label}
            </NavLink>
          ))}
        </nav>
        <div className="position-absolute bottom-0 w-100 p-3">
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left me-2"></i>Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
