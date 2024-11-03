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
import DietPlansPage from "./DietPlans";

import "../App.css";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      // Decode the token and check its expiration
      const { exp } = jwtDecode(accessToken);
      // console.log(exp);
      // console.log("hi");
      if (Date.now() >= exp * 1000) {
        // Access token expired, try to refresh
        if (refreshToken) {
          const response = await fetch(
            "http://localhost:8000/api/users/token/refresh/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            console.log(true);
            setIsAuthenticated(true);
          } else {
            console.log(false);
            // Refresh token expired or invalid, log out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        }
      } else {
        // Access token is valid
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);
  return (

    <Router>
      <div>
        <NavBar isAuthenticated={isAuthenticated} />
        <Routes>
          <Route
            path="/diet"
            element={
              isAuthenticated ? (
                <Diet isAuthenticated={isAuthenticated} />
              ) : (
                <Login
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )
            }
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
            path="/dashboard"
            element={
              <Dashboard
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/dietplans"
            element={<DietPlansPage isAuthenticated={isAuthenticated} />}
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
  // return (
  //   <Router>
  //     <div>
  //       <NavBar isAuthenticated={isAuthenticated} />
  //       <Routes>
  //         <Route
  //           path="/diet"
  //           element={
  //             <ProtectedRoute isAuthenticated={isAuthenticated}>
  //               <Diet isAuthenticated={isAuthenticated} />
  //             </ProtectedRoute>
  //           }
  //         />
  //         <Route
  //           path="/workout"
  //           element={
  //             <ProtectedRoute isAuthenticated={isAuthenticated}>
  //               <Workout isAuthenticated={isAuthenticated} />
  //             </ProtectedRoute>
  //           }
  //         />
  //         <Route
  //           path="/workoutplans"
  //           element={<WorkoutPlansPage isAuthenticated={isAuthenticated} />}
  //         />
  //         <Route
  //           path="/progress"
  //           element={<Progress isAuthenticated={isAuthenticated} />}
  //         />
  //         <Route
  //           path="/community"
  //           element={<Community isAuthenticated={isAuthenticated} />}
  //         />
  //         <Route
  //           path="/login"
  //           element={
  //             <Login
  //               isAuthenticated={isAuthenticated}
  //               setIsAuthenticated={setIsAuthenticated}
  //             />
  //           }
  //         />
  //         <Route
  //           path="/dashboard"
  //           element={
  //             <ProtectedRoute isAuthenticated={isAuthenticated}>
  //               <Dashboard
  //                 isAuthenticated={isAuthenticated}
  //                 setIsAuthenticated={setIsAuthenticated}
  //               />
  //             </ProtectedRoute>
  //           }
  //         />
  //         <Route
  //           path="/dietplans"
  //           element={<DietPlansPage isAuthenticated={isAuthenticated} />}
  //         />
  //         <Route
  //           path="/signup"
  //           element={<Signup isAuthenticated={isAuthenticated} />}
  //         />
  //         <Route
  //           path="/"
  //           element={<Home isAuthenticated={isAuthenticated} />}
  //         />
  //         <Route path="/Knowledge" element={<Knowledge />} />
  //         <Route path="/UserPost" element={<UserPost />} />
  //         {/* <Route path="*" element={<Navigate to="/" />} /> */}
  //       </Routes>
  //       <Footer />
  //     </div>
  //   </Router>
  //);
}

export default App;
