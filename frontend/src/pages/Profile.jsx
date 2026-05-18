import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/statsService";
import Card from "../components/Card";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    applied: 0,
    waiting: 0,
    interviewed: 0,
    decision: 0,
    totalSkills: 0,
    averageComfortLevel: null,
  });
  const [profile] = useState({
    avatar: "https://i.pravatar.cc/150",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }

    async function loadDashboard() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.log(err.message);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="body">
      <h1>Dashboard</h1>
      <img src={profile.avatar} className="profile-avatar" />
      <h2>Welcome, User #{user?.user_id}</h2>

      <div className="stats-grid">
        <Card>
          <h3>Total Jobs</h3>
          <p>{stats.totalJobs}</p>
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

        <Card>
          <h3>Total Skills</h3>
          <p>{stats.totalSkills}</p>
        </Card>

        <Card>
          <h3>Avg. Comfort</h3>
          <p>{stats.averageComfortLevel ?? "N/A"}</p>
        </Card>
      </div>
    </div>
  );
}