import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Hero from "../components/Hero"; 

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
    <Hero />
    <div className="body">
      <div className="button-group">
      <Button onClick={() => navigate("/login")}>
        Sign in
      </Button>

      <Button onClick={() => navigate("/signup")}>
        Sign up
      </Button>
      </div>
    </div>
    </>
  );
}