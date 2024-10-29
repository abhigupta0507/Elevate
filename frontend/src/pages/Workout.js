import React, { useState, useEffect } from "react";
import "../components/styles/Workout.css"; // Import appropriate styles

export default function WorkoutPage() {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [message, setMessage] = useState(""); // Message for feedback

  // Fetch today's exercises from the backend API
  const fetchExercises = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    fetch(
      `http://127.0.0.1:8000/api/workouts/exercises/today/?user_id=${userDetails.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setExerciseList(data.exercises);
        if (data.exercises.length === 0) {
          return;
        }
        setCurrentExercise(data.exercises[0]); // Set first exercise as default
      })
      .catch((error) => console.error("Error fetching exercises:", error));
  };

  // Fetch completed exercises for today
  const fetchCompletedExercises = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    fetch(
      `http://127.0.0.1:8000/api/workouts/completed_exercises/?user_id=${userDetails.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCompletedExercises(data.completed_exercises);
        //console.log(completedExercises);
      })
      .catch((error) =>
        console.error("Error fetching completed exercises:", error)
      );
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
    fetchExercises(); // Call fetchExercises on component mount
    fetchCompletedExercises(); // Call fetchCompletedExercises on component mount
  }, []);

  useEffect(() => {
    calculateTotalCalories(); // Calculate total calories burned when exerciseList or completedExercises changes
  }, [exerciseList, completedExercises]);

  // Handle when the user selects an exercise
  const handleExerciseSelect = (exercise) => {
    setCurrentExercise(exercise);
    setMessage(""); // Clear previous messages when switching exercises
  };

  // Handle when the user marks an exercise as done
  const handleCompleteExercise = (exerciseId) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    fetch(`http://127.0.0.1:8000/api/workouts/mark_done/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userDetails.id,
        workout_exercise_id: exerciseId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update message and fetch completed exercises again
          setMessage("Exercise marked as done!");
          fetchCompletedExercises(); // Fetch completed exercises again to update state
        } else {
          setMessage(data.message || "Failed to mark exercise as done.");
        }
      })
      .catch((error) => {
        console.error("Error marking exercise done:", error);
        setMessage("Error occurred while marking exercise as done.");
      });
  };

  return (
    <div className="workout-container">
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
                  completedExercises.includes(exercise.id) ? "completed" : ""
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
              completedExercises.includes(currentExercise.id) ? "disabled" : ""
            }`}
          >
            {completedExercises.includes(currentExercise.id)
              ? "Completed"
              : "Mark as Done"}
          </button>
        </div>
      )}

      {/* Bottom Section: Total Calories Burned
      <div className="calories-burned-section">
        <h2>Total Calories Burned Today: {totalCaloriesBurned}</h2>
        {message && <p className="feedback-message">{message}</p>}
      </div> */}
    </div>
  );
}
