import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Dietplans.css"; // Assuming you have some CSS for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback

export default function DietPlansPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dietPlans, setDietPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const navigate = useNavigate();

  const notifyError = (message) =>
    toast.error(message, { position: "top-right" });

  const notifySuccess = (message) =>
    toast.success(message, { position: "top-right" });

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      // Decode the token and check its expiration
      const { exp } = jwtDecode(accessToken);
      if (Date.now() / 1000 >= exp) {
        console.log("exp");
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
  useEffect(() => {
    async function fetchplan() {
      await checkAuthentication();
      const token = localStorage.getItem("accessToken");
      const headersNoauth = {
        Authorization: `Bearer ${token}`,
      };

      if (!token) {
        fetch("http://localhost:8000/api/diet/diet-plans/", {
          headersNoauth,
        })
          .then((response) => response.json())
          .then((plansData) => setDietPlans(plansData))
          .catch(() =>
            notifyError("Error fetching workout plans!", "top-right")
          );
      } else {
        if (!isAuthenticated) {
          fetch(`http://localhost:8000/api/diet/user-diet-plan/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.diet_plan) {
                setCurrentPlan(data);
              } else {
              }
            })
            .catch(() =>
              notifyError("Error fetching current workout plan!", "top-right")
            );
        } else {
          fetch("http://localhost:8000/api/diet/diet-plans/", {
            headersNoauth,
          })
            .then((response) => response.json())
            .then((plansData) => setDietPlans(plansData))
            .catch(() =>
              notifyError("Error fetching workout plans!", "top-right")
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

    fetch("http://localhost:8000/api/diet/user-diet-plan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
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

  const handleExitPlan = async () => {
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

    fetch(`http://localhost:8000/api/diet/exit-diet-plan/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setCurrentPlan(null);
        notifySuccess("Successfully exited the Diet plan!", "top-right");
      })
      .catch(() => notifyError("Error exiting Diet plan!", "top-right"))
      .then(
        fetch("http://localhost:8000/api/diet/diet-plans/")
          .then((response) => response.json())
          .then((plansData) => setDietPlans(plansData))
          .catch(() =>
            notifyError("Error fetching workout plans!", "top-right")
          )
      );
  };

  return (
    <>
      <ToastContainer />
      <div className="diet-plans-page">
        {!currentPlan ? (
          <div>
            <h2>Select a Diet Plan</h2>
            <div className="plans-container">
              {dietPlans.length > 0 ? (
                dietPlans.map((plan) => (
                  <div className="plan-card" key={plan.id}>
                    <h3>{plan.plan_name}</h3>
                    <p>Category: {plan.category.category_name}</p> {/* Displaying category */}
                    <p>Description: {plan.description || "No description available."}</p> {/* Displaying description */}
                    <button
                      onClick={() =>
                        handleSelectPlan(plan.id, plan.plan_name)
                      }
                    >
                      Choose Plan
                    </button>
                  </div>
                ))
              ) : (
                <p>No available diet plans. Refresh the page.</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2>Your Current Diet Plan</h2>
            {currentPlan && currentPlan.diet_plan ? (
              <div className="current-plan-card">
                <h3>{currentPlan.diet_plan.plan_name}</h3>
                <p>Category: {currentPlan.diet_plan.category.category_name}</p> {/* Displaying category for current plan */}
                <button onClick={() => navigate("/diet")}>
                  Today's meals
                </button>
                <button onClick={() => handleExitPlan()}>Exit Plan</button>
              </div>
            ) : (
              <p>Loading diet plan details...</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
