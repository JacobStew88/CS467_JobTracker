import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="body">
      <h1>This is the homepage</h1>
      <div className="button-group">
      <Button onClick={() => navigate("/login")}>
        Sign in
      </Button>

      <Button onClick={() => navigate("/signup")}>
        Sign up
      </Button>
      </div>
    </div>
  );
}