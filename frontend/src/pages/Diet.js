import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback
import "../components/styles/Dietplan.css"; // Assuming you have some CSS for styling
import { FaSpinner } from "react-icons/fa";
export default function TodaysMealsPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithAuth = (url, options = {}) => {
    const token = localStorage.getItem("accessToken");
    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  };

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/api/diet/todays-meals/")
      .then((response) => response.json())
      .then((data) => setMeals(data))
      .catch(() =>
        toast.error("Error fetching meals", { position: "top-right" })
      )
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div>
        <div className="mx-auto flex justify-center flex-col items-center">
          <p className="ml-2 text-l">Your meals are being loaded...</p>
          <FaSpinner className="animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="todays-meals-page">
      <ToastContainer />
      <h2>TODAY'S MEALS</h2>
      {meals.length > 0 ? (
        <table className="meals-table">
          <thead>
            <tr>
              <th>TIME</th>
              <th>MEAL</th>
              <th>CALORIES (kcal)</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id}>
                <td>{meal.meal_type.meal_type_name}</td>
                <td>{meal.meal_name}</td>
                <td>{meal.calories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No meals found for today.</p>
      )}
    </div>
  );
}
