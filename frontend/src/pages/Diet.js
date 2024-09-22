// import React from "react";
// import "../components/styles/Diet.css"; // Import the CSS for styling
// import dietHome from "../images/diet_Home.jpg";
// const Diet = () => {
//   return (
//     <>
//       <OptionsChoose  />
//       <Timepass/>
//       <HomepageCard heading="Weight Loss" detail="
//         Our Weight Loss Plan is designed to help you shed those extra pounds in a sustainable and healthy way. Focusing on nutrient-dense, lower-calorie meals, this plan will guide you through a balanced approach to weight loss. Enjoy delicious and satisfying meals without feeling deprived, and track your progress to see how each step brings you closer to your goals. With portion control, healthy fats, and lean proteins, you'll be fueled and motivated to stay on track."
//        photo={dietHome} buttonContent="Apply Now" />
//       <HomepageCard heading="Weight Gain" detail="
//       Looking to gain muscle and add healthy weight? Our Weight Gain Plan is structured to help you build mass in a balanced and nutritious way. This plan incorporates high-calorie, nutrient-rich meals that provide the right mix of proteins, carbs, and fats to support muscle growth and recovery. Designed for both beginners and advanced fitness enthusiasts, the plan includes frequent meals that nourish and fuel your body, ensuring that your weight gain is healthy and sustainable."
//       photo={dietHome} 
//       buttonContent="Apply Now"
//       />
      
//       <HomepageCard  heading="Maintenance" detail="Our Maintenance Plan is perfect for those who want to maintain their current weight while keeping their body healthy and fueled. Balanced with the right mix of macronutrients, this plan helps you sustain your current physique without feeling restricted. With a focus on whole foods, healthy portions, and variety, you can enjoy your favorite meals while maintaining your fitness goals. Whether you’re looking to stay fit or transition from weight loss or gain, this plan is designed to support your long-term health"
//       photo={dietHome}
//       buttonContent="Apply Now" />
//     </>
//   );
// };

// function OptionsChoose() {
//   return (
//     <div className="diet-page">
//       <h1>Select Your Diet Plan</h1>
//       <div className="cards-container">
//         <div className="card">
//           <h2>Weight Loss</h2>
//           <p>
//             Choose a weight loss plan designed for calorie deficit and fat
//             reduction.
//           </p>
//         </div>
//         <div className="card">
//           <h2>Weight Gain</h2>
//           <p>
//             Select a weight gain plan focused on muscle building and healthy
//             calorie surplus.
//           </p>
//         </div>
//         <div className="card">
//           <h2>Maintenance</h2>
//           <p>
//             Opt for a balanced diet to maintain your current weight and stay
//             healthy.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Timepass(){
//   return(<div>
//     <h1 className="timepass-heading">
//       More On These Plans
//     </h1>
//   </div>)
// }

// function HomepageCard({heading,detail,photo,buttonContent}) {
//   return (
//     <div className="class-studio-container">
//       <div className="class-studio-text">
//         <h1>{heading}</h1>
//         <p>
//           {detail}
//         </p>
//         <button className="class-button">{buttonContent}</button>
//       </div>
//       <div className="class-studio-video">
//         <img
//           src={photo}
//           alt="Workout Class"
//           className="class-video-placeholder"
//         />
//       </div>
//     </div>
//   );
// }

// export default Diet;

import React from "react";
import "../components/styles/Diet.css"; // Import the CSS for styling
import dietHome from "../images/diet_Home.jpg";

const Diet = () => {
  return (
    <>
      <OptionsChoose />
      <Timepass />
      <HomepageCard
        id="weight-loss-section"
        heading="Weight Loss"
        detail="Our Weight Loss Plan is designed to help you shed those extra pounds in a sustainable and healthy way. Focusing on nutrient-dense, lower-calorie meals, this plan will guide you through a balanced approach to weight loss. Enjoy delicious and satisfying meals without feeling deprived, and track your progress to see how each step brings you closer to your goals. With portion control, healthy fats, and lean proteins, you'll be fueled and motivated to stay on track."
        photo={dietHome}
        buttonContent="Apply Now"
      />
      <HomepageCard
        id="weight-gain-section"
        heading="Weight Gain"
        detail="Looking to gain muscle and add healthy weight? Our Weight Gain Plan is structured to help you build mass in a balanced and nutritious way. This plan incorporates high-calorie, nutrient-rich meals that provide the right mix of proteins, carbs, and fats to support muscle growth and recovery. Designed for both beginners and advanced fitness enthusiasts, the plan includes frequent meals that nourish and fuel your body, ensuring that your weight gain is healthy and sustainable."
        photo={dietHome}
        buttonContent="Apply Now"
      />
      <HomepageCard
        id="maintenance-section"
        heading="Maintenance"
        detail="Our Maintenance Plan is perfect for those who want to maintain their current weight while keeping their body healthy and fueled. Balanced with the right mix of macronutrients, this plan helps you sustain your current physique without feeling restricted. With a focus on whole foods, healthy portions, and variety, you can enjoy your favorite meals while maintaining your fitness goals."
        photo={dietHome}
        buttonContent="Apply Now"
      />
    </>
  );
};

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
        <div className="card" onClick={() => scrollToSection("weight-loss-section")}>
          <h2>Weight Loss</h2>
          <p>Choose a weight loss plan designed for calorie deficit and fat reduction.</p>
        </div>
        <div className="card" onClick={() => scrollToSection("weight-gain-section")}>
          <h2>Weight Gain</h2>
          <p>Select a weight gain plan focused on muscle building and healthy calorie surplus.</p>
        </div>
        <div className="card" onClick={() => scrollToSection("maintenance-section")}>
          <h2>Maintenance</h2>
          <p>Opt for a balanced diet to maintain your current weight and stay healthy.</p>
        </div>
      </div>
    </div>
  );
}

function Timepass() {
  return (
    <div>
      <h1 className="timepass-heading">More On These Plans</h1>
    </div>
  );
}

function HomepageCard({ id, heading, detail, photo, buttonContent }) {
  return (
    <div id={id} className="class-studio-container">
      <div className="class-studio-text">
        <h1>{heading}</h1>
        <p>{detail}</p>
        <button className="class-button">{buttonContent}</button>
      </div>
      <div className="class-studio-video">
        <img src={photo} alt="Workout Class" className="class-video-placeholder" />
      </div>
    </div>
  );
}

export default Diet;
