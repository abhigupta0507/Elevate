import React, { useState, useEffect } from "react";
import "../components/styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import badge1 from "../images/badge_1.png";
import badge2 from "../images/badge_2.png";
import badge3 from "../images/badge_3.png";
import userImg from "../images/user.png"; // Your CSS for styling

const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
  const [currentDietPlan, setCurrentDietPlan] = useState(null);
  const [badges, setBadges] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userDetails"));

  if (!user) {
    // Redirect to login if no user is found
    navigate("/login");
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("userDetails");
    alert("You have logged out!!");
    navigate("/");
  };
  console.log(currentDietPlan);

  useEffect(() => {
    // Fetch the current workout plan for the logged-in user
    fetch(`http://localhost:8000/api/workouts/user-workout-plan/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.workout_plan) {
          setCurrentWorkoutPlan(data.workout_plan); // Set the current plan if it exists
        } else {
          // If no plan exists, fetch all available workout plans
          setCurrentWorkoutPlan(null);
        }
      })
      .catch((error) => console.log("Error fetching current workout plan!"));

    fetch(`http://localhost:8000/api/diet/user-diet-plan/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.diet_plan) {
          setCurrentDietPlan(data);
         // console.log(data.diet_plan.category);
          // Set the current plan if it exists
        } else {
          // If no plan exists, fetch all available workout plans
          setCurrentDietPlan(null);
        }
      })
      .catch((error) => console.log("Error fetching current workout plan!"));

    fetch(`http://localhost:8000/api/badges/user-badges/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setBadges(data); // Assume this is setting the earned badges
      })
      .catch((error) => console.log("Error fetching badges!"));
  }, [user.id]);

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
          <p>Member since: {user.join_date}</p>
        </div>
      </div>

      {/* Workout Plan Enrolled Section */}
      <div className="plan-section">
        <h3>Workout Plan Enrolled</h3>
        {currentWorkoutPlan ? (
          <div className="plan-details">
            <p>
              <strong>Plan:</strong> {currentWorkoutPlan?.workout_name}
            </p>
            <p>
              <strong>Type:</strong> {currentWorkoutPlan?.workout_type}
            </p>
            <p>
              <strong>Days per week:</strong> {currentWorkoutPlan?.days_per_week}
            </p>
            <p>
              <strong>Description:</strong> {currentWorkoutPlan?.description}
            </p>
          </div>
        ) : (
          <p>No workout plan enrolled yet.</p>
        )}
      </div>

      {/* Diet Plan Enrolled Section */}
      <div className="plan-section">
        <h3>Diet Plan Enrolled</h3>
        <div className="plan-details">
        <p>
            <strong>Plan:</strong> {currentDietPlan?.diet_plan.plan_name}
            </p>
            <p>
              <strong>Category:</strong> {currentDietPlan?.diet_plan.category.category_name}
            </p>
            <p>
              <strong>Description:</strong> {currentDietPlan?.diet_plan.description}
            </p>
        </div>
      </div>

      <div className="badges-section">
        <h3>Collected Badges</h3>
        <div className="badges-grid">
          {badges.length > 0 ? (
            badges.map((badgeData, index) => (
              <div key={index} className="badge-card">
                <img
                  src={badgeData.badge.badge_icon} // Use fetched badge icon
                  alt={`${badgeData.badge.badge_name} Icon`}
                  className="badge-icon"
                />
                <div className="badge-info">
                  <h4>{badgeData.badge.badge_name}</h4>
                  <p>{badgeData.badge.badge_description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No badges earned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
