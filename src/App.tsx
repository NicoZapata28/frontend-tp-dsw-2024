import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import LoginForm from "./components/LoginForm"
import Navigation from "./components/Navigation"
import Home from "./components/Home"
import MaterialsPage from "./components/materials/MaterialsPage.tsx"
import OrdersPage from "./components/orders/OrdersPage.tsx"
import CustomersPage from "./components/customers/CustomersPage.tsx"
import Footer from "./components/Footer"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [employeeName, setEmployeeName] = useState<string>('')

  interface DecodedToken {
    id: string
    cuil: string
    name: string
    exp: number
    iat: number
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log("Token:", token)
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token)
      setEmployeeName(decodedToken.name)
      console.log(decodedToken)
      setIsLoggedIn(true)
    } }, [])

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navigation onLogout={handleLogout} employeeName={employeeName}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
