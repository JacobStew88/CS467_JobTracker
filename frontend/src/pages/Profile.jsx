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
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    waiting: 0,
    interviewed: 0,
    decision: 0,
  });
  const [profile, setProfile] = useState({
  avatar: "https://i.pravatar.cc/150"
});


useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    console.log("DECODED JWT:", decoded);
    setUser(decoded);
  }

  async function loadDashboard() {
    try {
      const data = await getJobs();
      const jobs = data;
      const newStats = {
        total: jobs.length,
        applied: 0,
        waiting: 0,
        interviewed: 0,
        decision: 0,
      };

      jobs.forEach((job) => {
        if (job.status === 'applied') newStats.applied++;
        if (job.status === 'waiting') newStats.waiting++;
        if (job.status === 'interviewed') newStats.interviewed++;
        if (job.status === 'decision') newStats.decision++;
      });
      setStats(newStats);
    } catch (err) {
      console.log(err.message);
    }
  }
  loadDashboard();
  }, []);

  return (
    <div className="body">
      <h1>Dashboard</h1>
      <img src={profile.avatar} className="profile-avatar"/>      
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
          <h3>Waiting</h3>
          <p>{stats.waiting}</p>
        </Card>
        <Card>
          <h3>Interviewed</h3>
          <p>{stats.interviewed}</p>
        </Card>
        <Card>
          <h3>Decision</h3>
          <p>{stats.decision}</p>
        </Card>
    </div>
  </div>
  );
}