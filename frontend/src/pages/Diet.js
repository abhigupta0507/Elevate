import React from 'react';
import '../components/styles/Diet.css'; // Import the CSS for styling

const Diet = () => {
  return (
    <div className="diet-page">
      <h1>Select Your Diet Plan</h1>
      <div className="cards-container">
        <div className="card">
          <h2>Weight Loss</h2>
          <p>Choose a weight loss plan designed for calorie deficit and fat reduction.</p>
        </div>
        <div className="card">
          <h2>Weight Gain</h2>
          <p>Select a weight gain plan focused on muscle building and healthy calorie surplus.</p>
        </div>
        <div className="card">
          <h2>Maintenance</h2>
          <p>Opt for a balanced diet to maintain your current weight and stay healthy.</p>
        </div>
      </div>
    </div>
  );
};

export default Diet;
