// src/pages/Login.jsx
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import GoogleLogo from "../assets/login-assets/Google__G__logo.svg.png";
import AppleLogo from "../assets/login-assets/Apple_logo_black.svg";
import '../styles/login.css';

/**
 * Login page component with Google OAuth and traditional email/password login
 */
function Login() {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
      email: "",
      password: ""
    });

  // Handle successful Google OAuth login
  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      // Send Google credential to backend for verification
      const response = await api.post("/api/auth/google", { credential: idToken });
      login(response.data.token, response.data.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Create a hidden div to contain the GoogleLogin button
  const renderGoogleLoginButton = () => {
    return (
      <div style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '0',
        height: '0',
        overflow: 'hidden'
      }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error("Google login failed")}
        />
      </div>
    );
  };

  return (
    <div className="login-page">
      {/* Welcome message and intro text */}
      <div className="header">
        <h1>Welcome to Film Flex</h1>
        <p>Rate and share the movies you just watched!</p>
      </div>

      <div className="login-container">
        <h2 className="form-title">Log in with</h2>
        {/* Social login buttons */}
        <div className="social-login">
          {/* Custom Google button that triggers the hidden GoogleLogin */}
          <button 
            className="social-button"
            onClick={() => document.querySelector('div[role=button]').click()}
          >
            <img src={GoogleLogo} alt="Google" className="social-icon" />
            Google
          </button>
          <button className="social-button">
            <img src={AppleLogo} alt="Apple" className="social-icon" />
            Apple
          </button>
        </div>

        <p className="seperator"><span>or</span></p>
        {/* Traditional email/password login form */}
        <form action="#" className="login-form">
          <div className="input-wrapper">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="input-field"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
            <i className="material-symbols-outlined"> mail</i>
          </div>

          <div className="input-wrapper">
            <input type="password" placeholder="Password" className="input-field" required/>
            <i className="material-symbols-outlined">lock</i>
          </div>
          <a href="#" className="forgot-pass-link">Forgot Password?</a>

          <button className="login-button">Log In</button>
        </form>
        {/* Sign up link for new users */}
       <p className="signup-text">Don't have an account? <a href="/signup">Sign up now!</a></p>
      </div>

      {/* Render the hidden GoogleLogin button */}
      {renderGoogleLoginButton()}
    </div>
  );
}

export default Login;