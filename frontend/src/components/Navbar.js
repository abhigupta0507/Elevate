import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logophoto from "../images/ELELOGOF.png";
import "./styles/navbar.css";
import { jwtDecode } from "jwt-decode";

function Logo() {
  return (
    <img
      width="200px"
      className="logo-navbar"
      src={logophoto}
      alt="elevate"
    ></img>
  );
}

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const path = window.location.pathname;
  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      // Decode the token and check its expiration
      const { exp } = jwtDecode(accessToken);
      console.log("hi");
      if (Date.now() >= exp * 1000) {
        console.log("expired");
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
  }, [path]);
  return (
    <div className="navbar">
      <div className="container">
        <div className="navbar-logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link className="link" to="/dietplans">
              <p className="link">Diet Plan</p>
            </Link>
          </li>
          <li>
            <Link className="link" to="/workoutplans">
              <p className="link">Workout Plan</p>
            </Link>
          </li>
          <li>
            <Link className="link" to="/progress">
              <p className="link">Track My Progress</p>
            </Link>
          </li>
          <li>
            <Link className="link" to="/community">
              <p className="link">Community</p>
            </Link>
          </li>
          {isAuthenticated ? (
            <li>
              <Link className="link" to="/dashboard">
                <p className="link">My Profile</p>
              </Link>
            </li>
          ) : (
            <li>
              <Link className="link" to="/login">
                <p className="link">Log In</p>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
