import React from 'react'
import Home from './Home'
import Form from './Form'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'; 

function App() {
  return (
    <Router>
    <div id="app">
      <nav>
        {/* NavLinks here */}
        <NavLink to="">Home</NavLink>
        <NavLink to="/order">Order</NavLink>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route path="/" element={<Home />}/>
      <Route path="/order" element={<Form />}/>
      </Routes>
    </div>
    </Router>
  )
}

export default App
