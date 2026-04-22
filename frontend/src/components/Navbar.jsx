// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="App">
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/about">About</Link>
    </nav>
    </div>
  );
}