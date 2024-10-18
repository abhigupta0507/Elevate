// import React, { useState, useEffect } from "react";
// import "../components/styles/Dashboard.css";
// import { useNavigate } from "react-router-dom";
// import badge1 from "../images/badge_1.png";
// import badge2 from "../images/badge_2.png";
// import badge3 from "../images/badge_3.png";
// import userImg from "../images/user.png"; // Your CSS for styling

// const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
//   const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("userDetails"));
//   if (!user) {
//   } // Get user details from localStorage

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem("userDetails");
//     alert("You have logged out!!");
//     navigate("/");
//   };

//   useEffect(() => {
//     // Retrieve user details from localStorage
//     //const userDetails = JSON.parse(localStorage.getItem("userDetails"));

//     // Fetch the current workout plan for the logged-in user
//     fetch(`http://localhost:8000/api/workouts/user-workout-plan/${user.id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.workout_plan) {
//           setCurrentWorkoutPlan(data.workout_plan); // Set the current plan if it exists
//         } else {
//           // If no plan exists, fetch all available workout plans
//           setCurrentWorkoutPlan(null);
//         }
//       })
//       .catch((error) => console.log("Error fetching current workout plan!"));
//   }, [user.id]);

//   // Sample badges data
//   const badges = [
//     {
//       id: 1,
//       name: "Workout Beginner",
//       icon: badge1,
//       description: "Awarded after completing 5 workouts.",
//     },
//     {
//       id: 2,
//       name: "Calorie Burner",
//       icon: badge2,
//       description: "Awarded after burning 500 calories.",
//     },
//     {
//       id: 3,
//       name: "Consistent Performer",
//       icon: badge3,
//       description: "Awarded for 7 days of consecutive workouts.",
//     },
//   ];

//   return (
//     <div className="dashboard-container">
//       {/* User Profile Section */}
//       <div className="user-profile">
//         <img src={userImg} alt="User Profile" className="profile-picture" />
//         <div className="user-info">
//           <h2>
//             {user.first_name} {user.last_name}
//           </h2>
//           <button onClick={handleLogout}>LogOut</button>
//           <p>Email: {user.email}</p>
//           <p>
//             Age: {user.age} | Height: {user.height} cm | Weight: {user.weight}{" "}
//             kg
//           </p>
//           <p>Member since: {user.join_date}</p>{" "}
//           {/* Adjust the join date based on your data */}
//         </div>
//       </div>

//       {/* Workout Plan Enrolled Section */}
//       <div className="plan-section">
//         <h3>Workout Plan Enrolled</h3>
//         <div className="plan-details">
//           <p>
//             <strong>Plan:</strong> {currentWorkoutPlan}
//           </p>
//           <p>
//             <strong>Type:</strong> {currentWorkoutPlan}
//           </p>
//           <p>
//             <strong>Days per week:</strong> {currentWorkoutPlan}
//           </p>
//         </div>
//       </div>

//       {/* Diet Plan Enrolled Section */}
//       <div className="plan-section">
//         <h3>Diet Plan Enrolled</h3>
//         <div className="plan-details">
//           <p>
//             <strong>Plan:</strong>abc
//           </p>
//           <p>
//             <strong>Category:</strong>
//           </p>
//         </div>
//       </div>

//       <div className="badges-section">
//         <h3>Collected Badges</h3>
//         <div className="badges-grid">
//           {badges.map((badge) => (
//             <div key={badge.id} className="badge-card">
//               <img
//                 src={badge.icon}
//                 alt={`${badge.name} Icon`}
//                 className="badge-icon"
//               />
//               <div className="badge-info">
//                 <h4>{badge.name}</h4>
//                 <p>{badge.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from "react";
import "../components/styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import badge1 from "../images/badge_1.png";
import badge2 from "../images/badge_2.png";
import badge3 from "../images/badge_3.png";
import userImg from "../images/user.png"; // Your CSS for styling

const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
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
  }, [user.id]);

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
            Age: {user.age} | Height: {user.height} cm | Weight: {user.weight} kg
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
              <strong>Plan:</strong> {currentWorkoutPlan.workout_name}
            </p>
            <p>
              <strong>Type:</strong> {currentWorkoutPlan.workout_type}
            </p>
            <p>
              <strong>Days per week:</strong> {currentWorkoutPlan.days_per_week}
            </p>
            <p>
              <strong>Description:</strong> {currentWorkoutPlan.description}
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
