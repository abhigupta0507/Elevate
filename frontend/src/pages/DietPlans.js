import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Dietplans.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import plan1 from "../images/plan1.jpg";
import { motion } from "framer-motion"; // Import Framer Motion
import plan2 from "../images/dp2.jpg";
import plan3 from "../images/dp3.jpg";
import { FaSpinner } from "react-icons/fa";

const dietPlanImages = {
  1: plan1,
  2: plan2,
  3: plan3,
};
export default function DietPlansPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dietPlans, setDietPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const navigate = useNavigate();
  const [selectButtonLoading, setSelectButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exitButtonLoading, setExitButtonLoading] = useState(false);

  const notifyError = (message) =>
    toast.error(message, { position: "top-right" });
  const notifySuccess = (message) =>
    toast.success(message, { position: "top-right" });

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const { exp } = jwtDecode(accessToken);
      if (Date.now() / 1000 >= exp) {
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
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        }
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };
  console.log(dietPlans);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      await checkAuthentication();
      const token = localStorage.getItem("accessToken");
      const headersNoauth = { "Content-Type": "application/json" };

      if (!token) {
        fetch("http://localhost:8000/api/diet/diet-plans/", {
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((plansData) => setDietPlans(plansData))
          .catch(() => notifyError("Error fetching workout plans!"));
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
              if (data.diet_plan) setCurrentPlan(data);
            })
            .catch(() => notifyError("Error fetching current workout plan!"));
        } else {
          fetch("http://localhost:8000/api/diet/diet-plans/", {
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((plansData) => setDietPlans(plansData))
            .catch(() => notifyError("Error fetching workout plans!"));
        }
      }
    }
    fetchPlans().finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleSelectPlan = async (planId, planName) => {
    await checkAuthentication();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Login again to select the plan");
      return;
    }

    const ans = window.confirm(`Confirm your workout plan: ${planName}`);
    if (!ans) return;

    setSelectButtonLoading(true);

    fetch("http://localhost:8000/api/diet/user-diet-plan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ diet_plan_id: planId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentPlan(data);
        notifySuccess("Plan selected successfully!");
      })
      .catch(() => notifyError("Error selecting plan!"))
      .finally(() => setSelectButtonLoading(false));
  };

  const handleExitPlan = async () => {
    const token = localStorage.getItem("accessToken");
    await checkAuthentication();
    if (!token) {
      alert("Login Expired...");
      navigate("/login");
    }

    const ans = window.confirm("Do you want to remove the current plan?");
    if (!ans) return;
    setExitButtonLoading(true);

    fetch("http://localhost:8000/api/diet/exit-diet-plan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setCurrentPlan(null);
        notifySuccess("Successfully exited the Diet plan!");
      })
      .catch(() => notifyError("Error exiting Diet plan!"))
      .then(
        fetch("http://localhost:8000/api/diet/diet-plans/")
          .then((response) => response.json())
          .then((plansData) => setDietPlans(plansData))
          .catch(() => notifyError("Error fetching workout plans!"))
      )
      .finally(() => setExitButtonLoading(false));
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6 max-w-3xl mx-auto">
        {!currentPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4">
              Discover Your Perfect Diet Plan
            </h2>

            <div className="space-y-6">
              {dietPlans.length > 0 ? (
                dietPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-48 h-48 flex-shrink-0">
                        <img
                          src={dietPlanImages[plan.id]}
                          className="w-full h-full object-cover rounded-lg"
                          alt="Diet plan"
                        />
                      </div>

                      <div className="pl-10 flex-1 space-y-4 justify-start">
                        <h3 className="text-2xl font-bold text-gray-900 text-left">
                          {plan.plan_name}
                        </h3>

                        <p className="text-gray-600 text-left">
                          {plan.description || "No description available."}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                            {plan.category.category_name}
                          </span>
                        </div>
                        <div className="flex justify-start">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleSelectPlan(plan.id, plan.plan_name)
                            }
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                          >
                            {selectButtonLoading ? (
                              <div className="flex justify-center items-center">
                                <FaSpinner className="animate-spin text-blue-500" />
                                <span className="ml-2 text-l">Loading...</span>
                              </div>
                            ) : (
                              " Choose Plan"
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex justify-center items-center">
                  <FaSpinner className="animate-spin text-blue-500" />
                  <span className="ml-2 text-l">Loading...</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4">
              Your Current Diet Plan
            </h2>

            {currentPlan && currentPlan.diet_plan ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-48 flex-shrink-0">
                    <img
                      src={dietPlanImages[currentPlan.diet_plan.id]}
                      className="w-full h-full object-cover rounded-lg"
                      alt="Current Diet Plan"
                    />
                  </div>

                  <div className="pl-10 flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 text-left">
                      {currentPlan.diet_plan.plan_name}
                    </h3>

                    <p className="text-gray-600 text-left">
                      {currentPlan.diet_plan.description ||
                        "No description available."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                        {currentPlan.diet_plan.category.category_name}
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/diet")}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        Today's meals
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExitPlan}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        {exitButtonLoading ? (
                          <div className="flex justify-center items-center">
                            <FaSpinner className="animate-spin text-blue-500" />
                            <span className="ml-2 text-l">Loading...</span>
                          </div>
                        ) : (
                          "Exit plan"
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-left text-gray-500 px-4">
                Loading diet plan details...
                <div className="flex justify-center items-center">
                  <FaSpinner className="animate-spin text-blue-500" />
                  <span className="ml-2 text-l">Loading...</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}
