import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/WorkoutPlans.css"; // Assuming you have some CSS for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback

export default function WorkoutPlansPage() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const navigate = useNavigate();

  // Notify user about any information
  const notifyInfo = (message, position) => {
    toast.info(message, {
      position: position,
    });
  };

  const notifyError = (message, position) => {
    toast.error(message, {
      position: position,
    });
  };

  useEffect(() => {
    // Retrieve user details from localStorage
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (!userDetails) {
      return;
    }

    // Fetch the current workout plan for the logged-in user
    fetch(
      `http://localhost:8000/api/workouts/user-workout-plan/${userDetails.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.workout_plan) {
          setCurrentPlan(data.workout_plan); // Set the current plan if it exists
        } else {
          // If no plan exists, fetch all available workout plans
          fetch("http://localhost:8000/api/workouts/workout-plans/")
            .then((response) => response.json())
            .then((plansData) => setWorkoutPlans(plansData))
            .catch((error) =>
              notifyError("Error fetching workout plans!", "top-right")
            );
        }
      })
      .catch((error) =>
        notifyError("Error fetching current workout plan!", "top-right")
      );
  }, [navigate]);

  // Function to handle when user selects a plan
  const handleSelectPlan = (planId) => {
    console.log(workoutPlans);
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    // Make request to assign the selected plan to the user
    fetch("http://localhost:8000/api/workouts/user-workout-plan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userDetails.id,
        workout_plan_id: planId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error assigning plan");
      })
      .then((data) => {
        setCurrentPlan(data); // Update with the new selected plan
        notifyInfo("Plan selected successfully!", "top-right");
      })
      .catch((error) => notifyError("Error selecting plan!", "top-right"));
  };
  // Function to handle exiting the workout plan
  const handleExitPlan = () => {};
  //   const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  //   fetch("http://127.0.0.1:8000/api/workouts/exit-workout-plan/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       //If you're using token-based authentication
  //     },
  //     body: JSON.stringify({ user_id: userDetails.id }), // Use user_id from local storage
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         setCurrentPlan(null); // Reset the current plan after exit
  //         notifyInfo("Successfully exited the workout plan.", "top-right");
  //       } else {
  //         throw new Error("Failed to exit the plan.");
  //       }
  //     })
  //     .catch((error) => notifyError("Error exiting the plan.", "top-right"));
  // };
  // try {
  //           const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  //           const response = await fetch('http://127.0.0.1:8000/api/workouts/exit-workout-plan/', {
  //               method: 'POST',
  //               headers: {
  //                   'Content-Type': 'application/json',
  //                   'Authorization': `Bearer ${userDetails.token}`, // Assuming you store the token in userDetails
  //               },
  //           });

  //           if (!response.ok) {
  //               throw new Error('Error: ' + (await response.text()));
  //           }

  //           const data = await response.json();
  //           setMessage(data.message);
  //       } catch (err) {
  //           setError(err.message || 'Something went wrong.');
  //       }

  // const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  // fetch('http://127.0.0.1:8000/api/workouts/exit-workout-plan/', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     // If you're using token-based authentication
  //   },
  //   body: JSON.stringify({ user_id: userDetails.id }) // Use user_id from local storage
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Handle the successful response
  //     console.log('Workout plan exited:', data);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  //   }

  return (
    <>
      <ToastContainer />
      <div className="workout-plans-page">
        {!currentPlan ? (
          <div>
            <h2>Select a Workout Plan</h2>
            <div className="plans-container">
              {workoutPlans.length > 0 ? (
                workoutPlans.map((plan) => (
                  <div className="plan-card" key={plan.id}>
                    <h3>{plan.workout_name}</h3>
                    <p>Type: {plan.workout_type}</p>
                    <p>Duration: {plan.program_duration} minutes</p>
                    <p>Days per week: {plan.days_per_week}</p>
                    <button onClick={() => handleSelectPlan(plan.id)}>
                      Choose Plan
                    </button>
                  </div>
                ))
              ) : (
                <p>No available workout plans.</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2>Your Current Workout Plan</h2>
            <div className="current-plan-card">
              <h3>{currentPlan.workout_name}</h3>
              <p>Type: {currentPlan.workout_type}</p>
              <p>Duration: {currentPlan.program_duration} minutes</p>
              <p>Days per week: {currentPlan.days_per_week}</p>
              <button onClick={() => navigate("/workout")}>
                View Today's Exercises
              </button>
              <button onClick={handleExitPlan} className="exit-plan-btn">
                Exit Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Render available plans or current plan
  // return (
  //   <>
  //     <ToastContainer />
  //     <div className="workout-plans-page">
  //       {!currentPlan ? (
  //         <div>
  //           <h2>Select a Workout Plan</h2>
  //           <div className="plans-container">
  //             {workoutPlans.length > 0 ? (
  //               workoutPlans.map((plan) => (
  //                 <div className="plan-card" key={plan.id}>
  //                   <h3>{plan.workout_name}</h3>
  //                   <p>Type: {plan.workout_type}</p>
  //                   <p>Duration: {plan.program_duration} minutes</p>
  //                   <p>Days per week: {plan.days_per_week}</p>
  //                   <button onClick={() => handleSelectPlan(plan.id)}>
  //                     Choose Plan
  //                   </button>
  //                 </div>
  //               ))
  //             ) : (
  //               <p>No available workout plans.</p>
  //             )}
  //           </div>
  //         </div>
  //       ) : (
  //         <div>
  //           <h2>Your Current Workout Plan</h2>
  //           <div className="current-plan-card">
  //             <h3>{currentPlan.workout_name}</h3>
  //             <p>Type: {currentPlan.workout_type}</p>
  //             <p>Duration: {currentPlan.program_duration} minutes</p>
  //             <p>Days per week: {currentPlan.days_per_week}</p>
  //             <button onClick={() => navigate("/workout")}>
  //               View Today's Exercises
  //             </button>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </>
  // );
}
