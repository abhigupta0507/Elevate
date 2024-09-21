import React from "react";
import { GoogleLogin } from "@react-oauth/google"; // Optional for Google login button
import "../components/styles/Login.css"; // For custom CSS styles

const Login = ({ type }) => {
  const handleGoogleSuccess = (response) => {
    console.log("Google login successful:", response.profileObj);
  };

  const handleGoogleFailure = (error) => {
    console.log("Google login failed:", error);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{type === "login" ? "Login" : "Signup"}</h1>

        {/* Input Fields */}
        <form className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          {type === "signup" && (
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button className="auth-button" type="submit">
            {type === "login" ? "Login" : "Signup"}
          </button>
        </form>

        <div className="divider">or</div>

        {/* Google Login Button */}
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID" // replace with actual client ID
          buttonText="Login with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={"single_host_origin"}
          className="google-login-button"
        />

        {/* Switch between Login and Signup */}
        {type === "login" ? (
          <p className="switch-auth">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        ) : (
          <p className="switch-auth">
            Already have an account? <a href="/login">Log in</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
