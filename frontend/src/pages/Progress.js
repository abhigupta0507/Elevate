// // import React, { useState } from "react";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";
// // import "../components/styles/Progress.css"; // Import the CSS for styling

// // // Sample data for calories burned graph
// // const caloriesData = [
// //   { day: "Mon", calories: 300 },
// //   { day: "Tue", calories: 450 },
// //   { day: "Wed", calories: 400 },
// //   { day: "Thu", calories: 500 },
// //   { day: "Fri", calories: 350 },
// //   { day: "Sat", calories: 600 },
// //   { day: "Sun", calories: 550 },
// // ];

// // // Sample statistics
// // const exerciseStats = {
// //   week: 10,
// //   month: 45,
// //   totalCalories: 3500,
// //   workoutsThisWeek: 5,
// //   dietThisWeek: "On Track",
// // };

// // // Sample goals/missions with progress
// // const missions = [
// //   {
// //     id: 1,
// //     goal: "Complete 5 workouts this week",
// //     isCompleted: true,
// //     progress: 100,
// //   },
// //   {
// //     id: 2,
// //     goal: "Burn 2000 calories in a week",
// //     isCompleted: false,
// //     progress: 50,
// //   },
// //   {
// //     id: 3,
// //     goal: "Follow diet plan for 7 consecutive days",
// //     isCompleted: true,
// //     progress: 100,
// //   },
// // ];

// // const Progress = () => {
// //   const [userMissions, setUserMissions] = useState(missions);

// //   // Function to show badges when goals are completed
// //   const renderBadge = (isCompleted) => {
// //     return isCompleted ? (
// //       <span className="badge">🏅</span>
// //     ) : (
// //       <span className="no-badge">No Badge Yet</span>
// //     );
// //   };

// //   return (
// //     <div className="track-progress-page">
// //       <h1 className="main-heading"></h1>

// //       {/* Calories Burned Graph */}
// //       <div className="progress-section">
// //         <h2 className="section-title">Calories Burned Per Day</h2>
// //         <ResponsiveContainer width="100%" height={300}>
// //           <LineChart data={caloriesData}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="day" />
// //             <YAxis />
// //             <Tooltip />
// //             <Legend />
// //             <Line
// //               type="monotone"
// //               dataKey="calories"
// //               stroke="#8884d8"
// //               activeDot={{ r: 8 }}
// //             />
// //           </LineChart>
// //         </ResponsiveContainer>
// //       </div>

// //       {/* Goals/Missions */}
// //       <div className="progress-section">
// //         <h2 className="section-title">Current Missions & Goals</h2>
// //         <div className="missions-container">
// //           {userMissions.map((mission) => (
// //             <div
// //               key={mission.id}
// //               className={`mission ${mission.isCompleted ? "completed" : ""}`}
// //             >
// //               <p>{mission.goal}</p>
// //               <div className="progress-bar">
// //                 <div
// //                   className="progress"
// //                   style={{ width: `${mission.progress}%` }}
// //                 ></div>
// //               </div>
// //               <p className="progress-percentage">
// //                 {mission.progress}% Completed
// //               </p>
// //               {renderBadge(mission.isCompleted)}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Progress;
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

  // Function to fetch calories data for the past 7 days
  useEffect(() => {
    fetch("http://localhost:8000/api/progress/calories_burned_last_7_days", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
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
