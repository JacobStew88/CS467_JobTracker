import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../services/authService";

export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await createAccount(email, password);

      alert(data.message || "Account created!");

      // send user to login page
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="body">
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}