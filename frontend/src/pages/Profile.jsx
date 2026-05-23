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
    skillCoverage: [],
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

        setStats((prev) => ({
          ...prev,
          ...data,
          skillCoverage: data.skillCoverage ?? [],
        }));
      } catch (err) {
        console.log(err.message);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <img src={profile.avatar} className="profile-avatar" />
        <h2>Welcome, User #{user?.user_id}</h2>
      </header>

      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Application Summary</h2>

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
      </section>

      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Skill Coverage</h2>

        <div className="skill-coverage-grid">
          {stats.skillCoverage.length === 0 ? (
            <Card>
              <h3>No skills yet</h3>
              <p>Add skills and assign them to jobs to see coverage.</p>
            </Card>
          ) : (
            stats.skillCoverage.map((skill) => (
            <Card key={skill.skillName} className="skill-card">
              <h3>{skill.skillName}</h3>
              <div className="skill-stats">
                <span>Comfort</span>
                <strong>{skill.comfortLevel} / 5</strong>
                <span>Jobs Using</span>
                <strong> {skill.jobsWithSkill} / {stats.totalJobs} </strong>
                <span>Coverage</span>
                <strong>{skill.percentageOfJobs}%</strong>
              </div>
            </Card>
            )))}
        </div>
      </section>
    </div>
  )};