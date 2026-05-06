
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Logo from "../assets/twotone-logo.png"; // your icon-only logo

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div>
        <div className="hero-b">
          <img className="hero-logo" src={Logo} alt="TruSmithy" />
        </div>
        <h1 className="hero-title">A Smarter Job Tracker</h1>
      </div>
    </section>
  );
}



