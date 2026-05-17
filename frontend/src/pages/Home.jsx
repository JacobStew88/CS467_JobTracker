import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Hero from "../components/Hero";
import { AuthContext } from "../components/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <Hero />

      <div className="body">
        <div className="button-group">
          {user ? (
            <Button onClick={() => navigate("/jobs")}>
              Go to Jobs
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate("/login")}>
                Sign in
              </Button>

              <Button onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}