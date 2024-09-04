import Navigation from "./components/Navigation.tsx"
import Materials from "./components/Materials.tsx"
import Orders from "./components/Orders.tsx"
import Home from "./components/Home.tsx"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const App = () => {
  return (
  <Router>  
    <Navigation/>
    <Routes>
      <Route path= "/Home" element={<Home />}/>
      <Route path="/materials" element={<Materials />}/>
      <Route path="/orders" element={<Orders/>}/>
    </Routes> 
  </Router>
  )
}

export default App