import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/WorkoutPlans.css"; // Assuming you have some CSS for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback

export default function WorkoutPlansPage() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
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

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (!userDetails) {
      fetch("http://localhost:8000/api/workouts/workout-plans/")
        .then((response) => response.json())
        .then((plansData) => setWorkoutPlans(plansData))
        .catch(() => notifyError("Error fetching workout plans!", "top-right"));

      return;
    }

    fetch(
      `http://localhost:8000/api/workouts/user-workout-plan/${userDetails.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.workout_plan) {
          setCurrentPlan(data);
        } else {
          fetch("http://localhost:8000/api/workouts/workout-plans/")
            .then((response) => response.json())
            .then((plansData) => setWorkoutPlans(plansData))
            .catch(() =>
              notifyError("Error fetching workout plans!", "top-right")
            );
        }
      })
      .catch(() =>
        notifyError("Error fetching current workout plan!", "top-right")
      );
  }, [navigate]);

  const handleSelectPlan = (planId, planName) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (!userDetails) {
      notifyError("Login to choose a plan", "top-right");
      return;
    }
    const ans = window.confirm(`Confirm your workout plan:- ${planName}`);
    if (!ans) {
      return;
    }
    fetch("http://localhost:8000/api/workouts/user-workout-plan/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userDetails.id,
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

  const handleExitPlan = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    // alert("Do you want to leave your current plan?");
    const ans = window.confirm("Do you want to remove the current plan");
    if (!ans) {
      return;
    }
    fetch(
      `http://localhost:8000/api/workouts/exit-workout-plan/${userDetails.id}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
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
            <h2>Select a Workout Plan</h2>
            <div className="plans-container">
              {workoutPlans.length > 0 ? (
                workoutPlans.map((plan) => (
                  <div className="plan-card" key={plan.id}>
                    <h3>{plan.workout_name}</h3>
                    <p>Type: {plan.workout_type}</p>
                    <p>Duration: {plan.program_duration} minutes</p>
                    <p>Days per week: {plan.days_per_week}</p>
                    <button
                      onClick={() =>
                        handleSelectPlan(plan.id, plan.workout_name)
                      }
                    >
                      Choose Plan
                    </button>
                  </div>
                ))
              ) : (
                <p>No available workout plans. Refresh the page</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2>Your Current Workout Plan</h2>
            {currentPlan && currentPlan.workout_plan ? ( // Add safety check
              <div className="current-plan-card">
                <h3>{currentPlan.workout_plan.workout_name}</h3>
                <p>Type: {currentPlan.workout_plan.workout_type}</p>
                <p>
                  Duration: {currentPlan.workout_plan.program_duration} minutes
                </p>
                <p>Days per week: {currentPlan.workout_plan.days_per_week}</p>
                <button onClick={() => navigate("/workout")}>
                  Today's exercises
                </button>
                <button onClick={() => handleExitPlan()}>Exit Plan</button>
              </div>
            ) : (
              <p>Loading workout plan details...</p> // Fallback in case data is not available yet
            )}
          </div>
        )}
      </div>
    </>
  );
}
