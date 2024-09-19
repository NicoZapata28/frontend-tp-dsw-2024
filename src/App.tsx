import { useState, useEffect } from "react"
import Navigation from "./components/Navigation.tsx"
import Materials from "./components/Materials.tsx"
import Orders from "./components/Orders.tsx"
import Home from "./components/Home.tsx"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from "./components/Footer.tsx"
import Customers from "./components/Customers.tsx"
import LoginForm from "./components/LoginForm.tsx"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log("Token:", token)
    if(token){
      setIsLoggedIn(true)
    }
  }, [])

  if (!isLoggedIn){
    return <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navigation onLogout={handleLogout}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App