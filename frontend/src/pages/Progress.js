// import React, { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import "../components/styles/Progress.css";
// import badge1 from "../images/badge_1.png";
// import badge2 from "../images/badge_2.png";
// import badge3 from "../images/badge_3.png";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// const badgeImages = {
//   1: badge1,
//   2: badge2,
//   3: badge3,
//   // Add other badges as needed
// };

// const Progress = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const checkAuthentication = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     const refreshToken = localStorage.getItem("refreshToken");

//     if (accessToken) {
//       // Decode the token and check its expiration
//       const { exp } = jwtDecode(accessToken);
//       if (Date.now() / 1000 >= exp) {
//         console.log("exp");
//         // Access token expired, try to refresh
//         if (refreshToken) {
//           const response = await fetch(
//             "http://localhost:8000/api/users/token/refresh/",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ refresh: refreshToken }),
//             }
//           ).catch((err) => console.log(err));

//           if (response.ok) {
//             const data = await response.json();
//             localStorage.setItem("accessToken", data.access);
//             //console.log(true);
//             setIsAuthenticated(true);
//           } else {
//             console.log(false);
//             // Refresh token expired or invalid, log out
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("refreshToken");
//             setIsAuthenticated(false);
//           }
//         }
//       } else {
//         // Access token is valid
//         setIsAuthenticated(true);
//       }
//     } else {
//       setIsAuthenticated(false);
//     }
//   };

//   const [caloriesData, setCaloriesData] = useState([]);
//   const [badges, setBadges] = useState([]);
//    useEffect(() => {
//     async function fetchbatchprogress() {
//       await checkAuthentication();
//       // Fetch badges data using JWT
//       const accessToken = localStorage.getItem("accessToken");

//       if (!accessToken) {
//         return;
//       }
//       await fetch("http://localhost:8000/api/badges/all-badges-and-user", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })
//         .then((response) => {
//           if (response.ok) return response.json();
//           throw new Error("Failed to fetch badges");
//         })
//         .then((data) => setBadges(data))
//         .catch((error) => console.log("Error fetching badges!", error));

//       await fetch(
//         "http://localhost:8000/api/progress/calories_burned_last_7_days",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       )
//         .then((response) => {
//           if (response.ok) return response.json();
//           throw new Error("Failed to fetch calories data");
//         })
//         .then((data) => setCaloriesData(data.calories_data))
//         .catch((error) => console.log("Error fetching calories data!", error));
//     }

//     fetchbatchprogress();
//   }, []);

//   return (
//     <>
//       {isAuthenticated ? (
//         <div>
//           <div className="track-progress-page">
//             <div className="progress-section">
//               <h2 className="section-title-pro">Calories Burned Per Day</h2>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={caloriesData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="calories"
//                     stroke="#8884d8"
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//           <div className="progress-container">
//             <h3>Celebrate your hard work with these badges!</h3>
//             <div className="badges-grid">
//               {badges.map((badge) => (
//                 <div key={badge.id} className="badge-card">
//                   <img
//                     src={badgeImages[badge.icon]}
//                     alt={`${badge.name} Icon`}
//                     className={
//                       badge.earned ? "badge-icon" : "badge-icon greyscale"
//                     }
//                   />
//                   <div className="badge-info">
//                     <h4>{badge.name}</h4>
//                     <p>{badge.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div>Login to track progress</div>
//       )}
//     </>
//   );
// };

// export default Progress;
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
import { motion } from "framer-motion";
import "../components/styles/Progress.css";
import badge1 from "../images/badge_1.png";
import badge2 from "../images/badge_2.png";
import badge3 from "../images/badge_3.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const badgeImages = {
  1: badge1,
  2: badge2,
  3: badge3,
  // Add other badges as needed
};

const Progress = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const { exp } = jwtDecode(accessToken);
      if (Date.now() / 1000 >= exp) {
        console.log("exp");
        if (refreshToken) {
          const response = await fetch(
            "http://localhost:8000/api/users/token/refresh/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          ).catch((err) => console.log(err));

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            setIsAuthenticated(true);
          } else {
            console.log(false);
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

  const [caloriesData, setCaloriesData] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    async function fetchBatchProgress() {
      await checkAuthentication();
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return;
      }
      await fetch("http://localhost:8000/api/badges/all-badges-and-user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Failed to fetch badges");
        })
        .then((data) => setBadges(data))
        .catch((error) => console.log("Error fetching badges!", error));

      await fetch(
        "http://localhost:8000/api/progress/calories_burned_last_7_days",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Failed to fetch calories data");
        })
        .then((data) => setCaloriesData(data.calories_data))
        .catch((error) => console.log("Error fetching calories data!", error));
    }

    fetchBatchProgress();
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <div>
          <motion.div
            className="track-progress-page"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="progress-section">
              <motion.h2
                className="section-title-pro"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Calories Burned Per Day
              </motion.h2>
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
          </motion.div>

          <motion.div
            className="progress-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h3
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Celebrate your hard work with these badges!
            </motion.h3>
            <div className="badges-grid">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  className="badge-card"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={badgeImages[badge.icon]}
                    alt={`${badge.name} Icon`}
                    className={
                      badge.earned ? "badge-icon" : "badge-icon greyscale"
                    }
                  />
                  <div className="badge-info">
                    <h4>{badge.name}</h4>
                    <p>{badge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div>Login to track progress</div>
      )}
    </>
  );
};

export default Progress;
