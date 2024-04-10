import './App.css';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';



function App() {
  
  

  return (
    <Router>
        <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/signup" element={<Signup/>} />
              <Route path="*" element={<Home />} /> {/* Fallback route */}
      </Routes>
  </Router>

  );
}

export default App;
