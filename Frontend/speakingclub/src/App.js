import './App.css';
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Room from './components/Room/Room';
import io from "socket.io-client";


function App() {
  
  return (
    <Router>
        <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/signup" element={<Signup/>} />
              <Route path="/room" element={<Room/>} />
              
              <Route path="*" element={<Home />} /> {/* Fallback route */}
      </Routes>
  </Router>

  );
}

export default App;
