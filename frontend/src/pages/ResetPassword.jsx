import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import Button from "../components/Button";
import Card from "../components/Card";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);

      alert("Password reset successful");

      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="body">
      <Card>
        <h1>Reset Password</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value)
            }
          />

          <Button type="submit">
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
}