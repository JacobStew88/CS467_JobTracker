import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from './pages/Login';
import SignUp from './pages/SignUp'
import Profile from "./pages/Profile"
import Jobs from "./pages/Jobs";
import Skills from './pages/Skills';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    <Navbar />
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/reset-password' element={<ResetPassword/>} />
     
      {/* PROTECTED ROUTES */}
      <Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute> <Jobs /></ProtectedRoute>} />  
      <Route path="/skills" element={<ProtectedRoute> <Skills /></ProtectedRoute>} />  
    </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
