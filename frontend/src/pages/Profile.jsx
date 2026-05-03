import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { getProtected } from "../services/authService";
import { createJob } from "../services/jobService";
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

  if (token) {
    const decoded = jwtDecode(token);
    console.log("DECODED JWT:", decoded);
    setUser(decoded);
  }

  async function loadProtected() {
    try {
      const data = await getProtected();
      console.log("PROTECTED DATA:", data);
      setProfile({
        bio: "This is my bio...",
        avatar: "https://i.pravatar.cc/150",
        jobsApplied: `${data.length}`
      });

      setMessage(`Jobs loaded: ${data.length}`);
    } catch (err) {
      setMessage(err.message);
    }
  }

  loadProtected();
}, []);

  return (
<div className="body">
  <h1>Dashboard</h1>
  <Card>
  <div>
    {/* Profile Picture */}
    <img src={profile.avatar} className="profile-avatar"/>

    {/* Username */}
    <h2>Welcome, User #{user?.user_id}</h2>

    {/* Bio */}
    <p><strong>Bio:</strong> {profile.bio || "No bio yet"}</p>

    {/* Jobs applied */}
    <p><strong>Jobs Applied:</strong> {profile.jobsApplied}</p>
  </div>
  </Card>
</div>
  );
}