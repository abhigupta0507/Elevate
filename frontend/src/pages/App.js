import React, { useEffect } from "react";
import { useState } from "react";
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
import WorkoutPlansPage from "./WorkoutPlans";
import "../App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(function () {
    const user = localStorage.getItem("userDetails");
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  return (
    <Router>
      <div>
        <NavBar isAuthenticated={isAuthenticated} />
        <Routes>
          <Route
            path="/diet"
            element={<Diet isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/workout"
            element={<Workout isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/workoutplans"
            element={<WorkoutPlansPage isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/progress"
            element={<Progress isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/community"
            element={<Community isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/login"
            element={
              <Login
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/signup"
            element={<Signup isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/"
            element={<Home isAuthenticated={isAuthenticated} />}
          />
          <Route path="/Knowledge" element={<Knowledge />} />
          <Route path="/UserPost" element={<UserPost />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
