import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { getProtected } from "../services/authService";
import { createJob } from "../services/jobService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }

    async function loadProtected() {
      try {
        const data = await getProtected();
        setMessage(data.message);
      } catch (err) {
        setMessage(err.message);
      }
    }

    loadProtected();
  }, []);

  return (
    <div className="body">
      <h1>Dashboard</h1>

      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <p>User is logged in</p>
        </div>
      ) : (
        <p>No user data found</p>
      )}

      <hr />

      <h3>Backend Status</h3>
      <p>{message}</p>
    </div>
  );
}