import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import logo from "../assets/standard-white-logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand icon only */}
        <Link className="brand" to="/" aria-label="TruSmithy Home">
          <img className="brand-logo" src={logo} alt="TruSmithy" />
        </Link>

        {/* Links */}
        <ul className="nav-links">
          {/* Public pages */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>

          {/* Authorized pages */}
          {user ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/jobs">Jobs</Link></li>
              <li><Button onClick={handleLogout}>Logout</Button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
