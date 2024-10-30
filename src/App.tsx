import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Materials from "./components/Materials";
import Orders from "./components/Orders";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from "./components/Footer";
import Customers from "./components/Customers";
import LoginForm from "./components/LoginForm";
import { jwtDecode } from 'jwt-decode';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  interface DecodedToken {
    id: string;
    cuil: string;
    name: string;
    exp: number;
    iat: number;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token:", token);
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setEmployeeName(decodedToken.name);
      console.log(decodedToken);
      setIsLoggedIn(true);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navigation onLogout={handleLogout} employeeName={employeeName} isMobile={isMobile} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;