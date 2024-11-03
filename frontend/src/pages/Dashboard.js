// import React, { useState, useEffect } from "react";
// import "../components/styles/Dashboard.css";
// import { useNavigate } from "react-router-dom";
// import badge1 from "../images/badge_1.png";
// import badge2 from "../images/badge_2.png";
// import badge3 from "../images/badge_3.png";
// import userImg from "../images/user.png"; // Your CSS for styling

// const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
//   const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
//   const [currentDietPlan, setCurrentDietPlan] = useState(null);
//   const [badges, setBadges] = useState([]);
//   const navigate = useNavigate();
//   //const user = JSON.parse(localStorage.getItem("userDetails"));
//   const [user, setUser] = useState({});
//   if (!user) {
//     // Redirect to login if no user is found
//     navigate("/login");
//   }

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     alert("You have logged out!!");
//     navigate("/");
//   };
//   console.log(currentDietPlan);
//   async function fetchUserDetails() {
//     const accessToken = localStorage.getItem("accessToken"); // Or wherever you store it
//     try {
//       const response = await fetch("http://localhost:8000/api/users/details/", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch user details");
//       const data = await response.json();
//       console.log("User details:", data);
//       setUser(data);
//       //alert(data.u);
//       // Use data as needed, e.g., to display on the profile page
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   useEffect(() => {
//     fetchUserDetails();
//   }, []);
//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken"); // Retrieve the access token from local storage

//     // Headers with Authorization
//     const headers = {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     };

//     // Fetch the current workout plan for the logged-in user
//     fetch(`http://localhost:8000/api/workouts/user-workout-plan/`, { headers })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.workout_plan) {
//           setCurrentWorkoutPlan(data.workout_plan); // Set the current plan if it exists
//         } else {
//           setCurrentWorkoutPlan(null); // If no plan exists, fetch all available workout plans
//         }
//       })
//       .catch((error) => console.log("Error fetching current workout plan!"));

//     // Fetch the current diet plan for the logged-in user
//     fetch(`http://localhost:8000/api/diet/user-diet-plan/`, { headers })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.diet_plan) {
//           setCurrentDietPlan(data); // Set the current diet plan if it exists
//         } else {
//           setCurrentDietPlan(null); // If no plan exists, handle accordingly
//         }
//       })
//       .catch((error) => console.log("Error fetching current diet plan!"));

//   }, []);

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
//           <p>Member since: {user.join_date}</p>
//         </div>
//       </div>

//       {/* Workout Plan Enrolled Section */}
//       <div className="plan-section">
//         <h3>Workout Plan Enrolled</h3>
//         {currentWorkoutPlan ? (
//           <div className="plan-details">
//             <p>
//               <strong>Plan:</strong> {currentWorkoutPlan?.workout_name}
//             </p>
//             <p>
//               <strong>Type:</strong> {currentWorkoutPlan?.workout_type}
//             </p>
//             <p>
//               <strong>Days per week:</strong>{" "}
//               {currentWorkoutPlan?.days_per_week}
//             </p>
//             <p>
//               <strong>Description:</strong> {currentWorkoutPlan?.description}
//             </p>
//           </div>
//         ) : (
//           <p>No workout plan enrolled yet.</p>
//         )}
//       </div>
//       {/* Diet Plan Enrolled Section */}
//       <div className="plan-section">
//         <h3>Diet Plan Enrolled</h3>
//         <div className="plan-details">
//           <p>
//             <strong>Plan:</strong> {currentDietPlan?.diet_plan.plan_name}
//           </p>
//           <p>
//             <strong>Category:</strong>{" "}
//             {currentDietPlan?.diet_plan.category.category_name}
//           </p>
//           <p>
//             <strong>Description:</strong>{" "}
//             {currentDietPlan?.diet_plan.description}
//           </p>
//         </div>
//       </div>

//       <div className="badges-section">
//         <h3>Collected Badges</h3>
//         <div className="badges-grid">
//           {badges.length > 0 ? (
//             badges.map((badgeData, index) => (
//               <div key={index} className="badge-card">
//                 <img
//                   src={badgeData.badge.badge_icon} // Use fetched badge icon
//                   alt={`${badgeData.badge.badge_name} Icon`}
//                   className="badge-icon"
//                 />
//                 <div className="badge-info">
//                   <h4>{badgeData.badge.badge_name}</h4>
//                   <p>{badgeData.badge.badge_description}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No badges earned yet.</p>
//           )}
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
import userImg from "../images/user.png";

const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
  const [currentDietPlan, setCurrentDietPlan] = useState(null);
  const [badges, setBadges] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  if (!user) {
    navigate("/login");
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("You have logged out!");
    navigate("/login");
  };

  //remove account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://localhost:8000/api/users/delete_account/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 204) {
        alert("Account deleted successfully.");
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/signup");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Failed to delete account."}`);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Helper function to refresh the access token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        const response = await fetch(
          "http://localhost:8000/api/users/token/refresh/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("accessToken", data.access);
          return data.access;
        } else {
          handleLogout(); // Logout if refresh fails
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        handleLogout();
      }
    } else {
      handleLogout();
    }
  };

  // Function to make authenticated requests with automatic token refresh
  const authenticatedFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      accessToken = await refreshAccessToken();
    }

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    let response = await fetch(url, options);
    if (response.status === 401) {
      accessToken = await refreshAccessToken();
      console.log("refreshed token for 401 error");
      if (accessToken) {
        options.headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(url, options);
      } else {
        navigate("/login");
      }
    }
    return response;
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await authenticatedFetch(
        "http://localhost:8000/api/users/details/"
      );
      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch the current workout plan for the logged-in user
  const fetchWorkoutPlan = async () => {
    try {
      const response = await authenticatedFetch(
        "http://localhost:8000/api/workouts/user-workout-plan/"
      );
      const data = await response.json();
      setCurrentWorkoutPlan(data.workout_plan || null);
    } catch (error) {
      console.error("Error fetching current workout plan:", error);
    }
  };

  // Fetch the current diet plan for the logged-in user
  const fetchDietPlan = async () => {
    try {
      const response = await authenticatedFetch(
        "http://localhost:8000/api/diet/user-diet-plan/"
      );
      const data = await response.json();
      setCurrentDietPlan(data.diet_plan ? data : null);
    } catch (error) {
      console.error("Error fetching current diet plan:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchWorkoutPlan();
    fetchDietPlan();
  }, []);

  return (
    <div className="dashboard-container">
  {/* User Profile Section */}
  <div className="user-card">
  <img src={userImg} alt="User Profile" className="profile-picture" />
  <div className="user-info">
    <h2>
      {user.first_name} {user.last_name}
    </h2>
    <p><span>Email:</span> {user.email}</p>
    <p>
      <span>Age:</span> {user.age} | <span>Height:</span> {user.height} cm | <span>Weight:</span> {user.weight} kg
    </p>
    <p><span>Member since:</span> {user.join_date}</p>
  </div>
</div>

  {/* Workout Plan Enrolled Section */}
  <div className="plan-section card">
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
  <div className="plan-section card">
    <h3>Diet Plan Enrolled</h3>
    {currentDietPlan ? (
      <div className="plan-details">
        <p>
          <strong>Plan:</strong> {currentDietPlan?.diet_plan.plan_name}
        </p>
        <p>
          <strong>Category:</strong>{" "}
          {currentDietPlan?.diet_plan.category.category_name}
        </p>
        <p>
          <strong>Description:</strong> {currentDietPlan?.diet_plan.description}
        </p>
      </div>
    ) : (
      <p>No diet plan enrolled yet.</p>
    )}
  </div>

  

  {/* Logout and Delete Account Buttons */}
  <div className="action-buttons">
    <button onClick={handleLogout} className="class-button">LogOut</button>
    <button onClick={handleDeleteAccount} className="class-button delete-button">
      Delete Account
    </button>
  </div>
</div>

);
};

export default Dashboard;
