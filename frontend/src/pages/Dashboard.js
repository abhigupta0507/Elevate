import React from "react";
import "../components/styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import badge1 from "../images/badge_1.png";
import badge2 from "../images/badge_2.png";
import badge3 from "../images/badge_3.png";
import userImg from "../images/user.png"; // Your CSS for styling

const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userDetails"));
  if (!user) {
  } // Get user details from localStorage

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("userDetails");
    alert("You have logged out!!");
    navigate("/");
  };

  // Sample badges data
  const badges = [
    {
      id: 1,
      name: "Workout Beginner",
      icon: badge1,
      description: "Awarded after completing 5 workouts.",
    },
    {
      id: 2,
      name: "Calorie Burner",
      icon: badge2,
      description: "Awarded after burning 500 calories.",
    },
    {
      id: 3,
      name: "Consistent Performer",
      icon: badge3,
      description: "Awarded for 7 days of consecutive workouts.",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* User Profile Section */}
      <div className="user-profile">
        <img src={userImg} alt="User Profile" className="profile-picture" />
        <div className="user-info">
          <h2>
            {user.first_name} {user.last_name}
          </h2>
          <button onClick={handleLogout}>LogOut</button>
          <p>Email: {user.email}</p>
          <p>
            Age: {user.age} | Height: {user.height} cm | Weight: {user.weight}{" "}
            kg
          </p>
          <p>Member since: {user.join_date}</p>{" "}
          {/* Adjust the join date based on your data */}
        </div>
      </div>

      {/* Workout Plan Enrolled Section */}
      <div className="plan-section">
        <h3>Workout Plan Enrolled</h3>
        <div className="plan-details">
          <p>
            <strong>Plan:</strong> xyz
          </p>
          <p>
            <strong>Duration:</strong> minutes
          </p>
          <p>
            <strong>Days per week:</strong>
          </p>
        </div>
      </div>

      {/* Diet Plan Enrolled Section */}
      <div className="plan-section">
        <h3>Diet Plan Enrolled</h3>
        <div className="plan-details">
          <p>
            <strong>Plan:</strong>abc
          </p>
          <p>
            <strong>Category:</strong>
          </p>
        </div>
      </div>

      <div className="badges-section">
        <h3>Collected Badges</h3>
        <div className="badges-grid">
          {badges.map((badge) => (
            <div key={badge.id} className="badge-card">
              <img
                src={badge.icon}
                alt={`${badge.name} Icon`}
                className="badge-icon"
              />
              <div className="badge-info">
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
