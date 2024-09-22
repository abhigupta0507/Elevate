import React from "react";
import "../components/styles/Dashboard.css";
import badge1 from "../images/badge_1.png";
import badge2 from "../images/badge_2.png";
import badge3 from "../images/badge_3.png";

const Dashboard = () => {
  // Sample user data
  const user = {
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    age: 25,
    height: 180,
    weight: 75,
    joinDate: "2023-01-01",
    streak: 7, // example streak count
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

  // Sample workout and diet plan data
  const workoutPlan = {
    name: "Full Body Strength Training",
    duration: 45,
    daysPerWeek: 4,
  };

  const dietPlan = {
    name: "Weight Loss Diet Plan",
    category: "Weight Loss",
  };

  return (
    <div className="dashboard-container">
      {/* User Profile Section */}
      <div className="user-profile">
        <img
          src={user.profilePicture}
          alt="User Profile"
          className="profile-picture"
        />
        <div className="user-info">
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>Email: {user.email}</p>
          <p>
            Age: {user.age} | Height: {user.height} cm | Weight: {user.weight}{" "}
            kg
          </p>
          <p>Member since: {user.joinDate}</p>
          <div className="streak-container">
            <p className="streak">
              <strong>🔥 {user.streak}-day streak</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Workout Plan Enrolled Section */}
      <div className="plan-section">
        <h3>Workout Plan Enrolled</h3>
        <div className="plan-details">
          <p>
            <strong>Plan:</strong> {workoutPlan.name}
          </p>
          <p>
            <strong>Duration:</strong> {workoutPlan.duration} minutes
          </p>
          <p>
            <strong>Days per week:</strong> {workoutPlan.daysPerWeek}
          </p>
        </div>
      </div>

      {/* Diet Plan Enrolled Section */}
      <div className="plan-section">
        <h3>Diet Plan Enrolled</h3>
        <div className="plan-details">
          <p>
            <strong>Plan:</strong> {dietPlan.name}
          </p>
          <p>
            <strong>Category:</strong> {dietPlan.category}
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
