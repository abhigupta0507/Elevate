import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../components/styles/Progress.css";

const Progress = () => {
  const [caloriesData, setCaloriesData] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  // Function to fetch calories data for the past 7 days
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Fetch badges for the logged-in user
    fetch(`http://localhost:8000/api/badges/user/${userDetails.id}`)
      .then((response) => response.json())
      .then((data) => setBadges(data))
      .catch((error) => console.log("Error fetching badges", error));
  }, [userDetails.id]);
  
  useEffect(() => {
    fetch(
      `http://localhost:8000/api/progress/calories_burned_last_7_days?user_id=${userDetails.id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log(data)
        setCaloriesData(data.calories_data);
      })
      // .then(console.log(caloriesData))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="track-progress-page">
      <h1 className="main-heading">Your Progress</h1>
      <div className="progress-section">
        <h2 className="section-title">Calories Burned Per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={caloriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Progress;
