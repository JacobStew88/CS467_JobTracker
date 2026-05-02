import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="navbar">
    <nav className="nav-links">
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/add-job">Add Job</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>

        </>
      )}
    </nav>
    </div>
  );
}