import React, { useState, useEffect } from "react";
import "../components/styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
// import badge1 from "../images/badge_1.png";
// import badge2 from "../images/badge_2.png";
// import badge3 from "../images/badge_3.png";
import userImg from "../images/user.png";
import EditProfileModal from "./EditProfileModal";
import { parseISO, format } from "date-fns";
const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
  const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
  const [currentDietPlan, setCurrentDietPlan] = useState(null);
  //const [badges, setBadges] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add this function to handle user updates
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };
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
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/delete_account/",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="dashboard-container">
      {/* User Profile Section */}
      <div className="user-card">
        <img src={userImg} alt="User Profile" className="profile-picture" />
        <div className="user-info">
          <h2>
            {user.first_name} {user.last_name}
          </h2>
          <p>
            <span>Email:</span> {user.email}
          </p>
          <p>
            <span>Age:</span> {user.age} | <span>Height:</span> {user.height} cm
            | <span>Weight:</span> {user.weight} kg
          </p>
          <p>
            <span>Member since:</span> {formatDate(user.join_date)}
          </p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="class-button edit-button"
        >
          Edit Profile
        </button>
      </div>

<<<<<<< HEAD
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
=======
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
              <strong>Days per week:</strong>{" "}
              {currentWorkoutPlan?.days_per_week}
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
              <strong>Description:</strong>{" "}
              {currentDietPlan?.diet_plan.description}
            </p>
          </div>
        ) : (
          <p>No diet plan enrolled yet.</p>
        )}
      </div>

      {/* Logout and Delete Account Buttons */}
      <div className="action-buttons">
        <button onClick={handleLogout} className="class-button">
          LogOut
        </button>
        <button
          onClick={handleDeleteAccount}
          className="class-button delete-button"
        >
          Delete Account
        </button>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={handleUserUpdate}
      />
    </div>
  );
>>>>>>> b1e035aa60bb4d70abf7a7827dd81d5ba5bd8d5d
};

export default Dashboard;
