import React, { useState, useEffect } from "react";
import "../components/styles/Workout.css"; // Import appropriate styles
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
const BadgeModal = ({ badge, onClose }) => (
  <div
    className="modal-overlay"
    onClick={(e) => e.target.classList.contains("modal-overlay") && onClose()}
  >
    <motion.div
      className="modal-content"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="modal-icon">
        <FaCheckCircle size={60} color="#4CAF50" />
      </div>
      <h2 className="modal-title">Congratulations!</h2>
      <p className="modal-message">You've earned the {badge} badge!</p>
      <button onClick={onClose} className="modal-close-button">
        Okay
      </button>
    </motion.div>
  </div>
);
export default function WorkoutPage() {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [message, setMessage] = useState(""); // Message for feedback
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newlyAwardedBadges, setNewlyAwardedBadges] = useState([]);
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();
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
          ).catch((err) => console.log(err));

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            //console.log(true);
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
        console.log("made it true");
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };
  //console.log(isAuthenticated);

  // Fetch today's exercises from the backend API
  function fetchExercises() {
    setPageLoading(true);
    //const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const token = localStorage.getItem("accessToken");
    fetch(`http://127.0.0.1:8000/api/workouts/exercises/today/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setExerciseList(data.exercises);
        if (data.exercises.length === 0) {
          return;
        }
        setCurrentExercise(data.exercises[0]); // Set first exercise as default
      })
      .catch((error) => console.error("Error fetching exercises:", error))
      .finally(() => setPageLoading(false));
  }

  // Fetch completed exercises for today
  const fetchCompletedExercises = () => {
    setPageLoading(true);
    //const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const token = localStorage.getItem("accessToken");

    fetch(`http://127.0.0.1:8000/api/workouts/completed_exercises/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setCompletedExercises(data.completed_exercises);
      })
      .catch((error) =>
        console.error("Error fetching completed exercises:", error)
      )
      .finally(() => setPageLoading(false));
  };

  const closeModal = () => {
    if (badgeIndex < newlyAwardedBadges.length - 1) {
      setBadgeIndex(badgeIndex + 1); // Show next badge
    } else {
      setShowBadgeModal(false); // Close modal if all badges are shown
    }
  };

  // Calculate total calories burned
  const calculateTotalCalories = () => {
    const totalCalories = exerciseList.reduce((total, exercise) => {
      if (completedExercises.includes(exercise.id)) {
        return total + exercise.calories_burned;
      }
      return total;
    }, 0);
    setTotalCaloriesBurned(totalCalories);
  };

  useEffect(() => {
    async function fetchexercisedandcompleted() {
      await checkAuthentication();
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
      } else {
        fetchExercises(); // Call fetchExercises on component mount
        fetchCompletedExercises();
      }
    }
    fetchexercisedandcompleted();
    // Call fetchCompletedExercises on component mount
  }, []);

  //console.log(exerciseList);
  useEffect(() => {
    calculateTotalCalories(); // Calculate total calories burned when exerciseList or completedExercises changes
  }, [exerciseList, completedExercises]);

  // Handle when the user selects an exercise
  const handleExerciseSelect = (exercise) => {
    setCurrentExercise(exercise);
    setMessage(""); // Clear previous messages when switching exercises
  };

  // Handle when the user marks an exercise as done
  // const handleCompleteExercise = async (exerciseId) => {
  //   setLoading(true);
  //   //const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  //   await checkAuthentication();
  //   const token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     navigate("/login");
  //   }
  //   //const token = localStorage.getItem("accessToken");
  //   fetch(`http://127.0.0.1:8000/api/workouts/mark_done/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       workout_exercise_id: exerciseId,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.success) {
  //         setMessage("Exercise marked as done!");
  //         fetchCompletedExercises();
  //         console.log(data.newly_awarded_badges);

  //         // Show the modal if there are newly awarded badges
  //         if (data.newly_awarded_badges.length > 0) {
  //           setNewlyAwardedBadges(data.newly_awarded_badges);
  //           setShowBadgeModal(true);
  //           setBadgeIndex(0); // Start from the first badge
  //         }
  //       } else {
  //         setMessage(data.message || "Failed to mark exercise as done.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error marking exercise done:", error);
  //       setMessage("Error occurred while marking exercise as done.");
  //     })
  //     .finally(() => setLoading(false));
  // };
  // Handle when the user marks an exercise as done
  // const handleCompleteExercise = async (exerciseId) => {
  //   setLoading(true);
  //   await checkAuthentication();
  //   const token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     navigate("/login");
  //   }

  //   fetch(`http://127.0.0.1:8000/api/workouts/mark_done/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({
  //       workout_exercise_id: exerciseId,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.success) {
  //         setMessage("Exercise marked as done!");

  //         // Update state immediately to reflect the completed exercise in the UI
  //         setCompletedExercises((prevCompleted) => [
  //           ...prevCompleted,
  //           exerciseId,
  //         ]);

  //         // Fetch completed exercises from server to ensure sync
  //         fetchCompletedExercises();

  //         if (data.newly_awarded_badges.length > 0) {
  //           setNewlyAwardedBadges(data.newly_awarded_badges);
  //           setShowBadgeModal(true);
  //           setBadgeIndex(0);
  //         }
  //       } else {
  //         setMessage(data.message || "Failed to mark exercise as done.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error marking exercise done:", error);
  //       setMessage("Error occurred while marking exercise as done.");
  //     })
  //     .finally(() => setLoading(false));
  // };
  // Handle when the user marks an exercise as done
  const handleCompleteExercise = async (exerciseId) => {
    setLoading(true);
    await checkAuthentication();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }

    fetch(`http://127.0.0.1:8000/api/workouts/mark_done/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workout_exercise_id: exerciseId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("Exercise marked as done!");

          // Update completed exercises state immediately
          setCompletedExercises((prevCompleted) => [
            ...prevCompleted,
            exerciseId,
          ]);

          if (data.newly_awarded_badges.length > 0) {
            setNewlyAwardedBadges(data.newly_awarded_badges);
            setShowBadgeModal(true);
            setBadgeIndex(0);
          }
        } else {
          setMessage(data.message || "Failed to mark exercise as done.");
        }
      })
      .catch((error) => {
        console.error("Error marking exercise done:", error);
        setMessage("Error occurred while marking exercise as done.");
      })
      .finally(() => setLoading(false));
  };

  // This useEffect will ensure that any changes to completedExercises trigger a re-render
  return (
    <div className="mx-auto workout-container">
      {pageLoading ? (
        <div className="mx-auto flex justify-center flex-col items-center">
          <p className="ml-2 text-l">Your exercises are being loaded...</p>
          <FaSpinner className="animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {showBadgeModal && (
            <BadgeModal
              badge={newlyAwardedBadges[badgeIndex]}
              onClose={closeModal}
            />
          )}
          {/* Left Section: List of Exercises */}
          {exerciseList.length > 0 ? (
            <div className="exercise-list">
              <h2>Your Workout</h2>
              <ul>
                {exerciseList.map((exercise) => (
                  <li
                    key={exercise.id}
                    onClick={() => handleExerciseSelect(exercise)}
                    className={
                      completedExercises.includes(exercise.id)
                        ? "completed"
                        : ""
                    }
                  >
                    {exercise.exercise_name}
                    {completedExercises.includes(exercise.id) && (
                      <span className="checkmark">✔</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No workout for today!</p>
          )}

          {/* Middle Section: Video and Details */}
          {currentExercise && (
            <div className="exercise-video-section">
              <h2>{currentExercise.exercise_name}</h2>
              <iframe
                className="exercise-video"
                src={currentExercise.video_url}
                title={currentExercise.exercise_name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <p>{currentExercise.description}</p>
            </div>
          )}

          {/* Right Section: Reps, Sets, and Completion */}
          {currentExercise && (
            <div className="exercise-details">
              <h2>Exercise Details</h2>
              <p>
                <strong>Sets:</strong> {currentExercise.sets}
              </p>
              <p>
                <strong>Reps:</strong> {currentExercise.reps}
              </p>
              <p className="exercise-details-calorie">
                <strong>Calories Burned per Exercise:</strong>{" "}
                {currentExercise.calories_burned}
              </p>
              <button
                onClick={() => handleCompleteExercise(currentExercise.id)}
                disabled={completedExercises.includes(currentExercise.id)}
                className={`complete-exercise-button ${
                  completedExercises.includes(currentExercise.id)
                    ? "disabled"
                    : ""
                }`}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <span className="ml-2 text-l">Marking it...</span>
                    <FaSpinner className="animate-spin text-blue-500" />
                  </div>
                ) : completedExercises.includes(currentExercise.id) ? (
                  "Completed"
                ) : (
                  "Mark as Done"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
