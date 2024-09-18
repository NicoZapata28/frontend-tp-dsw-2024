import Navigation from "./components/Navigation.tsx"
import Materials from "./components/Materials.tsx"
import Orders from "./components/Orders.tsx"
import Home from "./components/Home.tsx"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from "./components/Footer.tsx"
import Customers from "./components/Customers.tsx"


const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navigation />
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