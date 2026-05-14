import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { getProtected } from "../services/authService";
import { createJob, getJobs } from "../services/jobService";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState({
  bio: "",
  avatar: null,
  jobsApplied: 0,
});


useEffect(() => {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });


  if (token) {
    const decoded = jwtDecode(token);
    console.log("DECODED JWT:", decoded);
    setUser(decoded);
  }

  async function loadDashboard() {
    try {
      const data = await getJobs();
      const jobs = data.jobs || data;

      setProfile((prev) => ({
        ...prev,
        jobsApplied: jobs.length,
      }));
    } catch (err) {
      console.log(err.message);
    }
  }
  loadDashboard();
  }, []);

  return (
    <div className="body">
      <h1>Dashboard</h1>
      <h2>Welcome, User #{user?.user_id}</h2>
      {/* STATS GRID */}
      <div className="stats-grid">
        <Card>
          <h3>Total Jobs</h3>
          <p>{stats.total}</p>
        </Card>
        <Card>
          <h3>Applied</h3>
          <p>{stats.applied}</p>
        </Card>
        <Card>
          <h3>Interview</h3>
          <p>{stats.interview}</p>
        </Card>
        <Card>
          <h3>Offers</h3>
          <p>{stats.offer}</p>
        </Card>
        <Card>
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </Card>
    </div>
  </div>
  );
}