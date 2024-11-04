import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/WorkoutPlans.css"; // Assuming you have some CSS for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback
import { jwtDecode } from "jwt-decode";
import plan2 from "../images/dietplan_coffee.jpg";
import { motion } from "framer-motion";
import plan1 from "../images/workplan1.jpg";
import plan3 from "../images/workplan1.jpg";
import { FaSpinner } from "react-icons/fa";
const WorkoutPlanImages = {
  1: plan1,
  2: plan2,
  3: plan3,
};
export default function WorkoutPlansPage() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [selectButtonLoading, setSelectButtonLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exitButtonLoading, setExitButtonLoading] = useState(false);

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
      setLoading(true);
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
          fetch("http://localhost:8000/api/workouts/user-workout-plan/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: ` Bearer ${token}`,
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
    fetchplan().finally(() => setLoading(false));
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

    setSelectButtonLoading(true);
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
      .catch(() => notifyError("Error selecting plan!", "top-right"))
      .finally(() => setSelectButtonLoading(false));
  };

  const handleExitPlan = async () => {
    const token = localStorage.getItem("accessToken");
    setExitButtonLoading(true);
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
    fetch("http://localhost:8000/api/workouts/exit-workout-plan/", {
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
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Uncover the Perfect Workout for You!
            </h2>

            <div className="space-y-6">
              {workoutPlans.length > 0 ? (
                workoutPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-48 sm:w-48 h-48 flex-shrink-0">
                        <img
                          src={WorkoutPlanImages[plan.id]}
                          className="w-full h-full object-cover rounded-lg"
                          alt="workout-image"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {plan.workout_name}
                        </h3>

                        <p className="text-gray-600">
                          {plan.description || "No description available."}
                        </p>

                        <div className="ml-10 flex flex-wrap gap-2">
                          <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                            Type: {plan.workout_type}
                          </span>
                          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            Duration: {plan.program_duration} minutes
                          </span>
                          <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                            {plan.days_per_week} days/week
                          </span>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleSelectPlan(plan.id, plan.workout_name)
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
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Your Current Workout Plan
            </h2>

            {currentPlan && currentPlan?.workout_plan ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-48 flex-shrink-0">
                    <img
                      src={WorkoutPlanImages[currentPlan?.workout_plan.id]}
                      className="w-full h-full object-cover rounded-lg"
                      alt="current-plan"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-left pl-10 text-2xl font-bold text-gray-900">
                      {currentPlan?.workout_plan.workout_name}
                    </h3>

                    <p className="text-left pl-10 text-gray-600">
                      {currentPlan?.workout_plan.description ||
                        "No description available."}
                    </p>

                    <div className="flex flex-wrap gap-2 pl-10">
                      <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                        {currentPlan?.workout_plan.workout_type}
                      </span>
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                        {currentPlan?.workout_plan.days_per_week} days/week
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2 pl-10">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/workout")}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        "Today's Exercises"
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
              <div className="text-center text-gray-500">
                Loading workout plan details...
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
