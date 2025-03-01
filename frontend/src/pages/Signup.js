import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../components/styles/Login.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    join_date: new Date().toISOString().split("T")[0],
    mobile_number: "",
  });

  // New state for OTP verification
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle OTP change
  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle initial signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/signup/initiate/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "OTP sent! Please verify your email.");
        setShowOTPForm(true);
      } else {
        setError(data.detail || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("Error connecting to server. Please try again later.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/signup/verify/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store tokens or user data if needed
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Account verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.detail || "OTP verification failed. Please try again.");
      }
    } catch (error) {
      setError("Error connecting to server. Please try again later.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  // Handle resending OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/signup/resend-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "OTP resent! Please check your email.");
      } else {
        setError(data.detail || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setError("Error connecting to server. Please try again later.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  // Render OTP verification form
  if (showOTPForm) {
    return (
      <div className="signup-container">
        <h2>Verify Your Email</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form className="signup-form" onSubmit={handleVerifyOTP}>
          <div className="form-group">
            <label htmlFor="otp">Enter OTP sent to {formData.email}</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleOTPChange}
              required
              maxLength="6"
              placeholder="Enter 6-digit OTP"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <p>
            Didn't receive OTP?{" "}
            <span
              style={{ color: "#007bff", cursor: "pointer" }}
              onClick={handleResendOTP}
            >
              Resend OTP
            </span>
          </p>
        </form>
      </div>
    );
  }

  // Render signup form
  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
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
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-column">
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Sending OTP..." : "Sign Up"}
        </button>
        <p className="already-text">
          Already have an account?{" "}
          <span style={{ color: "#007bff" }}>
            <Link to="/login">Log In</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;