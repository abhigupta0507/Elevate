import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/WorkoutPlans.css"; // Assuming you have some CSS for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback
import { jwtDecode } from "jwt-decode";
import dietplanCoffeeImage from "../images/dietplan_coffee.jpg";
export default function WorkoutPlansPage() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const notifyInfo = (message, position) => {
    toast.info(message, { position: position });
  };

  const notifyError = (message, position) => {
    toast.error(message, { position: position });
  };

  const notifySuccess = (message, position) => {
    toast.success(message, { position: position });
  };

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      // Decode the token and check its expiration
      const { exp } = jwtDecode(accessToken);
      if (Date.now() / 1000 >= exp) {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function fetchplan() {
      await checkAuthentication();

      const token = localStorage.getItem("accessToken");

      const headersNoauth = {
        "Content-Type": "application/json",
      };

      if (!token) {
        fetch("http://localhost:8000/api/workouts/workout-plans/", {
          headersNoauth,
        })
          .then((response) => response.json())
          .then((plansData) => setWorkoutPlans(plansData))
          .catch(() =>
            notifyError("Error fetching workout plans!", "top-right")
          );
      } else {
        if (!isAuthenticated) {
          fetch("http://localhost:8000/api/workouts/workout-plans/", {
            headersNoauth,
          })
            .then((response) => response.json())
            .then((plansData) => setWorkoutPlans(plansData))
            .catch(() =>
              notifyError("Error fetching workout plans!", "top-right")
            );
        } else {
          fetch(`http://localhost:8000/api/workouts/user-workout-plan/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.workout_plan) {
                setCurrentPlan(data);
              } else {
              }
            })
            .catch(() =>
              notifyError("Error fetching current workout plan!", "top-right")
            );
        }
      }
    }
    fetchplan();
  }, [isAuthenticated]);

  const handleSelectPlan = async (planId, planName) => {
    await checkAuthentication();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Login again to select the plan");
      return;
    }

    const ans = window.confirm(`Confirm your workout plan:- ${planName}`);
    if (!ans) {
      return;
    }
    //const token = localStorage.getItem("accessToken");
    fetch("http://localhost:8000/api/workouts/user-workout-plan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workout_plan_id: planId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentPlan(data);
        notifySuccess("Plan selected successfully!", "top-right");
      })
      .catch(() => notifyError("Error selecting plan!", "top-right"));
  };

  const handleExitPlan = async () => {
    alert("Do you want to leave your current plan?");
    const token = localStorage.getItem("accessToken");
    await checkAuthentication();
    if (!token) {
      alert("Login Expired...");
      navigate("/login");
    }

    const ans = window.confirm("Do you want to remove the current plan");
    if (!ans) {
      return;
    }
    //const token = localStorage.getItem("accessToken");
    fetch(`http://localhost:8000/api/workouts/exit-workout-plan/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setCurrentPlan(null);
        notifySuccess("Successfully exited the workout plan!", "top-right");
      })
      .catch(() => notifyError("Error exiting workout plan!", "top-right"))
      .then(
        fetch("http://localhost:8000/api/workouts/workout-plans/")
          .then((response) => response.json())
          .then((plansData) => setWorkoutPlans(plansData))
          .catch(() =>
            notifyError("Error fetching workout plans!", "top-right")
          )
      );
  };

  return (
    <>
      <ToastContainer />
      <div className="workout-plans-page">
        {!currentPlan ? (
          <div>
            <h2 className="section-title">Select a Workout Plan</h2>
            <div className="outer-container">
              <div className="workout-plan-container">
                {workoutPlans.length > 0 ? (
                  workoutPlans.map((plan) => (
                    <div className="workout-plan-container" key={plan.id}>
                      <div className="class-studio-video">
                        <img
                          src={dietplanCoffeeImage}
                          className="plan-image"
                        />
                      </div>
                      <div className="class-studio-text">
                        <h1>{plan.workout_name}</h1>
                        <p>{plan.description || "No description available."}</p>
                        <span className="plan-category">Type: {plan.workout_type}</span>
                        <span className="plan-category">Duration: {plan.program_duration} minutes</span>
                        <span className="plan-category">Days per week: {plan.days_per_week}</span>
                        <div className="button-group">
                          <button
                            className="class-button"
                            onClick={() => handleSelectPlan(plan.id, plan.workout_name)}
                          >
                            Choose Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No available workout plans. Refresh the page.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="section-title">Your Current Workout Plan</h2>
            <div className="outer-container">
              {currentPlan && currentPlan.workout_plan ? (
                <div className="workout-plan-container">
                  <div className="class-studio-video">
                    <img
                      src={dietplanCoffeeImage}
                      className="plan-image"
                      
                    />
                  </div>
                  <div className="class-studio-text">
                    <h1>{currentPlan.workout_plan.workout_name}</h1>
                    <p>{currentPlan.workout_plan.description || "No description available."}</p>
                    <span className="plan-category">{currentPlan.workout_plan.workout_type}</span>
                    <span className="plan-category">Duration: {currentPlan.workout_plan.program_duration} minutes</span>
                    <span className="plan-category">{currentPlan.workout_plan.days_per_week} days a week</span>
                    <div className="button-group">
                      <button onClick={() => navigate("/workout")} className="class-button">
                        Today's exercises
                      </button>
                      <button onClick={handleExitPlan} className="class-button exit-button">
                        Exit Plan
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading workout plan details...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}