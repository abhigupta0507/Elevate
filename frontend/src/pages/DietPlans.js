import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Dietplans.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback

export default function DietPlansPage() {
  const [dietPlans, setDietPlans] = useState([]);
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
      fetch("http://localhost:8000/api/diet/diet-plans/")
        .then((response) => response.json())
        .then((plansData) => setDietPlans(plansData))
        .catch(() => notifyError("Error fetching diet plans!", "top-right"));

      return;
    }

    fetch(`http://localhost:8000/api/diet/user-diet-plan/${userDetails.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.diet_plan) {
          setCurrentPlan(data);
        } else {
          fetch("http://localhost:8000/api/diet/diet-plans/")
            .then((response) => response.json())
            .then((plansData) => setDietPlans(plansData))
            .catch(() =>
              notifyError("Error fetching diet plans!", "top-right")
            );
        }
      })
      .catch(() =>
        notifyError("Error fetching current diet plan!", "top-right")
      );
  }, [navigate]);

  const handleSelectPlan = (planId, planName) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (!userDetails) {
      notifyError("Login to choose a plan", "top-right");
      return;
    }
    const ans = window.confirm(`Confirm your diet plan: ${planName}`);
    if (!ans) {
      return;
    }
    fetch("http://localhost:8000/api/diet/user-diet-plan/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userDetails.id,
        diet_plan_id: planId,
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
    const ans = window.confirm("Do you want to remove the current plan?");
    if (!ans) {
      return;
    }
    fetch(
      `http://localhost:8000/api/diet/exit-diet-plan/${userDetails.id}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then(() => {
        setCurrentPlan(null);
        notifySuccess("Successfully exited the diet plan!", "top-right");
        // Fetch updated diet plans
        fetch("http://localhost:8000/api/diet/diet-plans/")
          .then((response) => response.json())
          .then((plansData) => setDietPlans(plansData))
          .catch(() => notifyError("Error fetching diet plans!", "top-right"));
      })
      .catch(() => notifyError("Error exiting diet plan!", "top-right"));
  };

  return (
    <>
    <ToastContainer />
    <div className="diet-plans-page">
      {!currentPlan ? (
        <div>
          <h2 className="section-title">Select a Diet Plan</h2>
          <div className="outer-container">
            <div className="plans-container">
              {dietPlans.length > 0 ? (
                dietPlans.map((plan) => (
                  <div className="diet-plan-container" key={plan.id}>
                    <div className="class-studio-text">
                      <h1>{plan.plan_name}</h1>
                      <p>Category: {plan.category.category_name}</p>
                      <p>Description: {plan.description || "No description available."}</p>
                      <button
                        className="class-button"
                        onClick={() => handleSelectPlan(plan.id, plan.plan_name)}
                      >
                        Choose Plan
                      </button>
                    </div>
                    <div className="class-studio-video">
                      <img
                        // Default image if no image_url is provided
                        // alt={`${plan.plan_name} Image`}
                        className="plan-image"
                        src={"Elevate\frontend\src\images\dietplan_coffee.jpg"}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No available diet plans. Refresh the page.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="section-title">Your Current Diet Plan</h2>
          <div className="outer-container">
            {currentPlan && currentPlan.diet_plan ? (
              <div className="diet-plan-container">
                <div className="class-studio-text">
                  <h1>{currentPlan.diet_plan.plan_name}</h1>
                  <p>PLAN CATEGORY: {currentPlan.diet_plan.category.category_name}</p>
                  <div className="button-group">
                    <button className="class-button" onClick={() => navigate("/diet")}>
                      Today's meals
                    </button>
                    <button className="class-button" onClick={() => handleExitPlan()}>
                      Exit Plan
                    </button>
                  </div>
                </div>
                <div className="class-studio-video">
                  <img
                    src={"Elevate\frontend\src\images\dietplan_coffee.jpg"} // Default image if no image_url is provided
                    alt={`${currentPlan.diet_plan.plan_name} Image`}
                    className="plan-image"
                  />
                </div>
              </div>
            ) : (
              <p>Loading diet plan details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  </>
  

  );
}
