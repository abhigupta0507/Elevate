import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Login.css";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const notifyError = (message, position) => {
    toast.error(message, {
      position: position,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch("http://localhost:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        localStorage.setItem("userFirstName", data.first_name); // Store the user's first name
        localStorage.setItem("userDetails", JSON.stringify(data));
        alert("You have successfully logged in!!");
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        const errorData = await response.json();
        console.log(errorData.detail); // Log the error message
        notifyError(errorData.detail, "top-right"); // Show error message to user
      }
    } catch (error) {
      console.error("An error occurred:", error);
      notifyError("An error occurred. Please try again later", "bottom-right");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <h2>Login to Your Account</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Login
        </button>
        <p className="already-text">
          Create a account{" "}
          <span style={{ color: "#007bff" }}>
            <Link to="/signup">Sign Up</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
