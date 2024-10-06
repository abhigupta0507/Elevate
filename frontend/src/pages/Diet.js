import React, { useState } from "react";
import "../components/styles/Diet.css"; // Import the CSS for styling
import dietHome from "../images/diet_Home.jpg";
import dietplancoffee from "../images/dietplan_coffee.jpg";
import "../components/styles/Dietplan.css";

const mealsForToday = {
  breakfast: [
    {
      name: "Coffee black no sugar",
      quantity: "100g",
      calories: 1,
      image: dietplancoffee, // Replace with your actual image URL
    },
    {
      name: "Bread",
      quantity: "2 slices",
      calories: 136,
      image: dietplancoffee,
    },
    {
      name: "Butter",
      quantity: "5g",
      calories: 36,
      image: dietplancoffee,
    },
  ],
  lunch: [
    {
      name: "Paneer home style cheese",
      quantity: "120g",
      calories: 385,
      image: dietplancoffee,
    },
    {
      name: "Rice dry uncooked",
      quantity: "40g",
      calories: 142,
      image: dietplancoffee,
    },
  ],
  // You can add more meals for evening and dinner here.
};

export default function Diet({ isAuthenticated }) {
  return (
    <>
      {isAuthenticated ? (
        <LoggedInDiet />
      ) : (
        <>
          <OptionsChoose />
          <Heading />
          <DescribeBlockCard
            id="weight-loss-section"
            heading="Weight Loss"
            detail="Our Weight Loss Plan is designed to help you shed those extra pounds in a sustainable and healthy way. Focusing on nutrient-dense, lower-calorie meals, this plan will guide you through a balanced approach to weight loss. Enjoy delicious and satisfying meals without feeling deprived, and track your progress to see how each step brings you closer to your goals. With portion control, healthy fats, and lean proteins, you'll be fueled and motivated to stay on track."
            photo={dietHome}
            buttonContent="Apply Now"
          />
          <DescribeBlockCard
            id="weight-gain-section"
            heading="Muscle Gain"
            detail="Looking to gain muscle and add healthy weight? Our Weight Gain Plan is structured to help you build mass in a balanced and nutritious way. This plan incorporates high-calorie, nutrient-rich meals that provide the right mix of proteins, carbs, and fats to support muscle growth and recovery. Designed for both beginners and advanced fitness enthusiasts, the plan includes frequent meals that nourish and fuel your body, ensuring that your weight gain is healthy and sustainable."
            photo={dietHome}
            buttonContent="Apply Now"
          />
          <DescribeBlockCard
            id="maintenance-section"
            heading="Maintenance"
            detail="Our Maintenance Plan is perfect for those who want to maintain their current weight while keeping their body healthy and fueled. Balanced with the right mix of macronutrients, this plan helps you sustain your current physique without feeling restricted. With a focus on whole foods, healthy portions, and variety, you can enjoy your favorite meals while maintaining your fitness goals."
            photo={dietHome}
            buttonContent="Apply Now"
          />
        </>
      )}
    </>
  );
}

function OptionsChoose() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="diet-page">
      <h1>Select Your Diet Plan</h1>
      <div className="cards-container">
        <div
          className="card"
          onClick={() => scrollToSection("weight-loss-section")}
        >
          <h2>Weight Loss</h2>
          <p>
            Choose a weight loss plan designed for calorie deficit and fat
            reduction.
          </p>
        </div>
        <div
          className="card"
          onClick={() => scrollToSection("weight-gain-section")}
        >
          <h2>Muscle Gain</h2>
          <p>
            Select a Muscle gain plan focused on muscle building and healthy
            calorie surplus.
          </p>
        </div>
        <div
          className="card"
          onClick={() => scrollToSection("maintenance-section")}
        >
          <h2>Maintenance</h2>
          <p>
            Opt for a balanced diet to maintain your current weight and stay
            healthy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div>
      <h1 className="timepass-heading">More On These Plans</h1>
    </div>
  );
}

function DescribeBlockCard({ id, heading, detail, photo, buttonContent }) {
  return (
    <div id={id} className="class-studio-container">
      <div className="class-studio-text">
        <h1>{heading}</h1>
        <p>{detail}</p>
        <button className="class-button">{buttonContent}</button>
      </div>
      <div className="class-studio-video">
        <img
          src={photo}
          alt="Workout Class"
          className="class-video-placeholder"
        />
      </div>
    </div>
  );
}

const Meal = ({ mealType, meals, handleMealChecked }) => {
  return (
    <div className="meal-section">
      <h2>{mealType.toUpperCase()}</h2>
      <div className="meal-section-types">
        {meals.map((meal, index) => (
          <div
            key={index}
            className={`meal-item ${meal.finished ? "finished" : ""}`}
          >
            <img src={meal.image} alt={meal.name} className="meal-image" />
            <div className="meal-info">
              <p style={{ fontWeight: "bold" }}>{meal.name}</p>
              <p>
                <span style={{ color: "red" }}>{meal.quantity}</span> |{" "}
                <span style={{ color: "green" }}>{meal.calories} kcal</span>
              </p>
            </div>
            <input
              type="checkbox"
              checked={meal.finished}
              onChange={() => handleMealChecked(mealType, index)}
            />
            {meal.finished && <span className="finished-label">Finished</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

function LoggedInDiet() {
  const [meals, setMeals] = useState(mealsForToday);
  const [extraCalories, setExtraCalories] = useState(0);

  const totalCalories = 1000;
  const totalConsumedCalories = Object.values(meals)
    .flat()
    .reduce((acc, meal) => {
      return acc + (meal.finished ? meal.calories : 0);
    }, 0);

  const handleMealChecked = (mealType, index) => {
    const updatedMeals = { ...meals };
    updatedMeals[mealType][index].finished =
      !updatedMeals[mealType][index].finished;
    setMeals(updatedMeals);
  };

  return (
    <div className="meal-plan-container">
      <h1>Today's Meal Plan</h1>

      {/* Render Meals in a Grid */}
      <div className="meal-grid">
        {Object.keys(meals).map((mealType) => (
          <Meal
            key={mealType}
            mealType={mealType}
            meals={meals[mealType]}
            handleMealChecked={handleMealChecked}
          />
        ))}
      </div>
    </div>
  );
}
