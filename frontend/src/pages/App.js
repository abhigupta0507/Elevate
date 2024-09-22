import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "../components/Navbar";
import Diet from "./Diet";
import Workout from "./Workout";
import Progress from "./Progress";
import Community from "./Community";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import Knowledge from "./Knowledge";
import Footer from "./Footer";
import UserPost from "./UserPost";
import Signup from "./Signup";
import "../App.css";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/diet" element={<Diet />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/Knowledge" element={<Knowledge />} />
          <Route path="/UserPost" element={<UserPost />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
