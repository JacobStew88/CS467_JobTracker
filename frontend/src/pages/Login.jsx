import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Login failed");
        return;
      }

      login(data.token); // store token + set auth state

      navigate("/profile"); // redirect after login
    } catch (err) {
      alert("Something went wrong");
    }
  }

  return (
    <div className="form-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="form">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-group">
        <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
}