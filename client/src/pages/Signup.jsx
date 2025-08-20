import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import GoogleLogo from "../assets/login-assets/Google__G__logo.svg.png";
import AppleLogo from "../assets/login-assets/Apple_logo_black.svg";
import '../styles/login.css';

/**
 * Signup page component with Google OAuth and traditional form registration
 */
function Signup(){

    const {login} = useContext(AuthContext);
    const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");

    // Handle successful Google OAuth signup
    const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      // Send Google credential to backend for account creation/login
      const response = await api.post("/api/auth/google", { credential: idToken });
      login(response.data.token, response.data.user);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  // Create hidden GoogleLogin component for custom UI styling
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
          onError={() => console.error("Google signup failed")}
        />
      </div>
    );
  };

  // Handle form input changes
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle traditional signup form submission
  const handleSignup = async e => {
    e.preventDefault();

    // Validate password confirmation
    if(form.password !== form.confirmPassword){
      setError("Passwords do not match");
      return;
    }
    try{
      // Submit signup data to backend
      const response = await api.post("/api/auth/signup", {
        username: form.username,
        email: form.email,
        password: form.password
      });
      login(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-page">
      {/* Welcome header */}
      <div className="header">
        <h1>Join Film Flex</h1>
        <p>Create an account to rate and share movies!</p>
      </div>

      <div className="login-container">
        <h2 className="form-title">Sign up with</h2>
        {/* Social signup options */}
        <div className="social-login">
          {/* Button that triggers hidden GoogleLogin */}
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

        {/* Traditional signup form */}
        <form className="login-form" onSubmit={handleSignup}>
          <div className="input-wrapper">
            <input name="username" type="text" placeholder="Username" className="input-field" required value={form.username} onChange={handleChange} />
            <i className="material-symbols-outlined">person</i>
          </div>
          <div className="input-wrapper">
            <input name="email" type="email" placeholder="Email address" className="input-field" required value={form.email} onChange={handleChange} />
            <i className="material-symbols-outlined">mail</i>
          </div>
          <div className="input-wrapper">
            <input name="password" type="password" placeholder="Password" className="input-field" required value={form.password} onChange={handleChange} />
            <i className="material-symbols-outlined">lock</i>
          </div>
          <div className="input-wrapper">
            <input name="confirmPassword" type="password" placeholder="Confirm Password" className="input-field" required value={form.confirmPassword} onChange={handleChange} />
            <i className="material-symbols-outlined">lock</i>
          </div>
          <button className="login-button">Sign Up</button>
          {/* Display validation or server errors */}
          {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
        {/* Login link for existing users */}
        <p className="signup-text">Already have an account? <a href="/login">Log in now!</a></p>
      </div>

      {renderGoogleLoginButton()}
    </div>
  );
}

export default Signup;


