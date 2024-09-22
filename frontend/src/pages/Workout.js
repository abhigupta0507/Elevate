import React, { useState } from "react";
import "../components/styles/Workout.css"; // Import appropriate styles

// Sample exercise data
const exercises = [
  {
    id: 1,
    name: "Push-Ups",
    sets: 4,
    reps: 15,
    videoUrl: "https://www.youtube.com/embed/lsRAK6cr5kY?si=q7hopVxqYUVvPIqt",
    description:
      "A basic upper body exercise targeting the chest, shoulders, and triceps. Maintain a straight body posture and lower yourself until your chest almost touches the floor.",
    caloriesBurned: 100,
    completed: false,
  },
  {
    id: 2,
    name: "Curls Up",
    sets: 4,
    reps: 20,
    videoUrl: "https://www.youtube.com/embed/KisIFYaUduU?si=ik--vnDyX6iAOE1C",
    description:
      "Curls up are a great exercise for strengthening the abdominal muscles and improving core stability. This exercise targets the rectus abdominis, helping to tone and define the stomach area",
    caloriesBurned: 120,
    completed: false,
  },
  {
    id: 3,
    name: "Plank",
    sets: 3,
    reps: "Hold for 1 min",
    videoUrl: "https://www.example.com/videos/plank.mp4",
    description:
      "An isometric core exercise that strengthens the abs and lower back. Hold your body in a straight line from head to toe while balancing on your forearms and toes.",
    caloriesBurned: 50,
    completed: false,
  },
  {
    id: 4,
    name: "Lunges",
    sets: 3,
    reps: 12,
    videoUrl: "https://www.example.com/videos/lunges.mp4",
    description:
      "An exercise targeting the quadriceps, hamstrings, and glutes. Step forward with one leg and lower your hips until both knees are bent at about 90 degrees.",
    caloriesBurned: 110,
    completed: false,
  },
  {
    id: 5,
    name: "Bicep Curls",
    sets: 4,
    reps: 12,
    videoUrl: "https://www.example.com/videos/bicep-curls.mp4",
    description:
      "A weightlifting exercise that targets the biceps. Lift the dumbbells towards your shoulders by bending your elbows and then slowly lower them back down.",
    caloriesBurned: 80,
    completed: false,
  },
];

export default function WorkoutPage() {
  const [currentExercise, setCurrentExercise] = useState(exercises[0]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [exerciseList, setExerciseList] = useState(exercises);

  // Handle when the user selects an exercise
  const handleExerciseSelect = (exercise) => {
    setCurrentExercise(exercise);
  };

  // Handle when the user finishes an exercise
  const handleCompleteExercise = (id) => {
    const updatedExercises = exerciseList.map((exercise) => {
      if (exercise.id === id && !exercise.completed) {
        setTotalCaloriesBurned((prev) => prev + exercise.caloriesBurned);
        return { ...exercise, completed: true };
      }
      return exercise;
    });
    setExerciseList(updatedExercises);
  };

  return (
    <div className="workout-container">
      {/* Left Section: List of Exercises */}
      <div className="exercise-list">
        <h2>Your Workout</h2>
        <ul>
          {exerciseList.map((exercise) => (
            <li
              key={exercise.id}
              onClick={() => handleExerciseSelect(exercise)}
              className={exercise.completed ? "completed" : ""}
            >
              {exercise.name}
              {exercise.completed && <span className="checkmark">✔</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Section: Video and Details */}
      <div className="exercise-video-section">
        <h2>{currentExercise.name}</h2>
        <iframe
          className="exercise-video"
          src={currentExercise.videoUrl}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
        <p>{currentExercise.description}</p>
      </div>

      {/* Right Section: Reps, Sets, and Completion */}
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
          {currentExercise.caloriesBurned}
        </p>
        <button
          onClick={() => handleCompleteExercise(currentExercise.id)}
          disabled={currentExercise.completed}
          className="complete-exercise-button"
        >
          {currentExercise.completed ? "Completed" : "Mark as Done"}
        </button>
      </div>

      {/* Bottom Section: Total Calories Burned */}
      <div className="calories-burned-section">
        <h2>Total Calories Burned Today: {totalCaloriesBurned}</h2>
      </div>
    </div>
  );
}
