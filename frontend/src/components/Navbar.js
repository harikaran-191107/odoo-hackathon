import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-brand">TransitOps</div>
      <div className="navbar-links">
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/vehicles" className={linkClass}>Vehicles</NavLink>
        <NavLink to="/drivers" className={linkClass}>Drivers</NavLink>
        <NavLink to="/trips" className={linkClass}>Trips</NavLink>
        <NavLink to="/maintenance" className={linkClass}>Maintenance</NavLink>
      </div>
      <div className="navbar-user">
        <span>{user.name} ({user.role})</span>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
