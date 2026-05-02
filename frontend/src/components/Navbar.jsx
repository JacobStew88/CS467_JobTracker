import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

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
      <a href="/">Home</a>

      {user ? (
        <>
          <a href="/profile">Profile</a>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </>
      )}
    </nav>
    </div>
  );
}