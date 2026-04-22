import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from './pages/Login';
import SignUp from './pages/SignUp'
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
