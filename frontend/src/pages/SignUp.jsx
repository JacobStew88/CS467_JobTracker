import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../services/authService";
import { useAuth } from "../components/AuthContext";

export default function AccountCreation() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("SUBMIT FIRED")

    try {
      const data = await createAccount(email, username, password); 
      console.log("API RESPONSE:",data);

      alert("Account created!");

      login(data.token);
      navigate("/profile");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="login-container">
      <h1>Account Creation</h1>

      <form onSubmit={handleSubmit} className="login-form">

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}