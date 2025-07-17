// src/pages/Login.jsx
 /** Import the prebuilt React component "GoogleLogin" from "@react-oauth/google" package.
 *
 * This built-in component automatically renders a Google-branded "Sign in with Google" button.
 * It handles the complete OAuth login flow in the browser, including redirect, token retrieval,
 * and invoking the appropriate onSuccess/onError handlers.
 * No need to build a custom button — this ensures a secure and up-to-date implementation.
 */
 import { GoogleLogin } from "@react-oauth/google";
 // Import the configured Axios instance that automatically attaches the app-issued JWT to API requests
 import api from "../services/api";
 // Import the AuthContext and React's built-in useContext hook
 // This is how we access the global authentication state
 import { useContext } from "react";
 import { AuthContext } from "../context/authContext";
 // Define the Login component that displays the login page and handles login logic
 function Login() {
  // Access the login function from AuthContext using useContext
  // The login() function stores the JWT and user info after successful authentication
  const { login } = useContext(AuthContext);
  /**
   * This function is triggered after the user successfully logs in via Google.
   * It acts as the bridge between Google OAuth on the frontend and secure authentication in our app.
   * 
   * Steps:
   * 1. Extract the ID token (credential) issued by Google.
   * 2. Send the ID token to our backend, which verifies it using google-auth-library.
   * 3. If valid, the backend responds with an app-issued JWT and user profile.
   * 4. Save this data in the app using the login() function from AuthContext.
   */
  const handleSuccess = async (credentialResponse) => {
    try {
      // Extract the Google-issued ID token (JWT) from the login response
      const idToken = credentialResponse.credential;
      // Send the ID token to the backend to verify and exchange for an app-issued JWT
      const response = await api.post("/api/auth/google", { credential: idToken });
      /** 
       * This login() call supports stateless authentication using JWT:
       * - Stores the JWT in localStorage to persist login across page reloads
       * - Saves the user info in localStorage as well
       * - Updates React app state so components can react to login status
       * - Keeps the user authenticated until they explicitly log out
       */
      login(response.data.token, response.data.user);
    } catch (error) {
      // Log any errors that occur during the login or backend exchange process
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="login-page">
      {/* Welcome message and intro text */}
      <h1>Welcome to Film Flex</h1>
      <p>Rate and share the movies you just watched!</p>
      {/* GoogleLogin renders a Sign in with Google button using the configured OAuth flow */}
      {/* When successful, calls handleSuccess with the ID token */}
      {/* onError provides a fallback in case login fails */}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Google login failed")}
      />
    </div>
  );
 }
 // Export the Login component so it can be used in React Router routes
 export default Login;