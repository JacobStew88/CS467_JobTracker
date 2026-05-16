import { useState } from "react";
import { forgotPassword, resetPassword } from "../services/authService";
import Button from "../components/Button";
import Card from "../components/Card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await forgotPassword(email);

      setMessage(response.message);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="body">
      <Card>
        <h1>Forgot Password</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <Button type="submit">
            Send Reset Link
          </Button>
        </form>

        {message && <p>{message}</p>}
      </Card>
    </div>
  );
}