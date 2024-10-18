import React, { useState, useEffect } from "react";
import "../components/styles/Workout.css"; // Import appropriate styles

export default function WorkoutPage() {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);

  // Fetch today's exercises from the backend API
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    //console.log(userDetails.id);
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
        setCurrentExercise(data.exercises[0]); // Set the first exercise as default
        setTotalCaloriesBurned(data.total_calories_burned); // Assuming backend returns the total calories burned
      })
      .catch((error) => console.error("Error fetching exercises:", error));
  }, []);

  // Handle when the user selects an exercise
  const handleExerciseSelect = (exercise) => {
    setCurrentExercise(exercise);
  };

  // Handle when the user finishes an exercise
  const handleCompleteExercise = (exerciseId) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    // fetch("http://127.0.0.1:8000/api/workouts/complete/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     exercise_id: exerciseId,
    //     user_id: userDetails.id,
    //   }),
    // })
    // .then((res) => res.json())
    // .then((data) => {
    //   if (data.detail === "Exercise marked as done") {
    //     // Update the exercise list to reflect completion
    //     setExerciseList((prevExercises) =>
    //       prevExercises.map((exercise) =>
    //         exercise.id === exerciseId
    //           ? { ...exercise, completed: true }
    //           : exercise
    //       )
    //     );

    //   // Update the total calories burned
    //   setTotalCaloriesBurned((prevCalories) => prevCalories + data.calories_burned);

    //   // Optionally display a success message or other UI updates
    // }
    // })
    // .catch((error) => console.error("Error completing exercise:", error));
  };

  return (
    <div className="workout-container">
      {/* Left Section: List of Exercises */}
      {exerciseList.length>0?
        (<div className="exercise-list">
          <h2>Your Workout</h2>
          <ul>
            {exerciseList.map((exercise) => (
              <li
                key={exercise.id}
                onClick={() => handleExerciseSelect(exercise)}
                className={exercise.completed ? "completed" : ""}
              >
                {exercise.exercise_name}
                {exercise.completed && <span className="checkmark">✔</span>}
              </li>
            ))}
          </ul>
        </div>):(<p>No workout for today get lost!!</p>)
      }

      {/* Middle Section: Video and Details */}
      {currentExercise && (
        <div className="exercise-video-section">
          <h2>{currentExercise.exercise_name}</h2>
          <iframe
            className="exercise-video"
            src={currentExercise.video_url}
            title={currentExercise.exercise_name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
            disabled={currentExercise.completed}
            className="complete-exercise-button"
          >
            {currentExercise.completed ? "Completed" : "Mark as Done"}
          </button>
        </div>
      )}

      {/* Bottom Section: Total Calories Burned */}
      <div className="calories-burned-section">
        <h2>Total Calories Burned Today: {totalCaloriesBurned}</h2>
      </div>
    </div>
  );
}
