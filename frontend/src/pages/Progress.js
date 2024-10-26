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
import badge1 from "../images/badge_1.png";
import badge2 from "../images/badge_2.png";
import badge3 from "../images/badge_3.png";

const badgeImages = {
  1: badge1,
  2: badge2,
  3: badge3,
  // Add other badges as needed
};

const Progress = () => {
  const [caloriesData, setCaloriesData] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  // Function to fetch calories data for the past 7 days
  const [badges, setBadges] = useState([]);
  useEffect(() => {
    // Fetch user badges data from the API
    fetch(
      `http://localhost:8000/api/badges/all-badges-and-user/${userDetails.id}`
    )
      .then((response) => response.json())
      .then((data) => setBadges(data))
      .catch((error) => console.log("Error fetching badges!"));
  }, []);

  console.log(badges);

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
    <>
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
      <div className="progress-container">
        <h3>Badges</h3>
        <div className="badges-grid">
          {badges.map((badge) => (
            <div key={badge.id} className="badge-card">
              <img
                src={badgeImages[badge.icon] || badge1} // Load based on `badge_icon`
                alt={`${badge.name} Icon`}
                className={badge.earned ? "badge-icon" : "badge-icon greyscale"} // Greyscale for unearned badges
              />
              <div className="badge-info">
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Progress;
