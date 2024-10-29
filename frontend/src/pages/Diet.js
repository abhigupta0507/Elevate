import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback
import "../components/styles/Dietplan.css"; // Assuming you have some CSS for styling

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
    return <div>Loading...</div>;
  }

  return (
    <div className="todays-meals-page">
      <ToastContainer />
      <h2>Today's Meals</h2>
      {meals.length > 0 ? (
        <div className="meals-container">
          {meals.map((meal) => (
            <div className="meal-card" key={meal.id}>
              <h3>{meal.meal_type.meal_type_name}</h3>
              <p>Meal Name: {meal.meal_name}</p>
              <p>Calories: {meal.calories} kcal</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No meals found for today.</p>
      )}
    </div>
  );
}
