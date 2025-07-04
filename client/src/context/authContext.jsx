// File: context/AuthContext.jsx
 import React, { createContext, useEffect, useState } from "react";
 // Create a Context object for global authentication state.
 export const AuthContext = createContext(null);
 /**
 * Component: AuthProvider
 *
 * This component provides global authentication state and methods (login/logout) to 
 * its children.
 * It uses React Context to allow nested components to access the current user and 
 * JWT token without prop drilling.
 *
 * Typical usage:
 *     
<AuthProvider>
 *       
 *     
 *
 <App />
 </AuthProvider>
 * Inside any child component, use useContext(AuthContext) to access auth state.
 */
 function AuthProvider({ children }) {
  // State to store the current user object (e.g., { name, email, picture })
  const [user, setUser] = useState(null);
  // State to store the JWT token received from backend
  const [token, setToken] = useState(null);
  /**
   * 
useEffect hook:
   * Runs once when the AuthProvider is first mounted (on initial render).
   *
   * This effect checks the browser's localStorage to see if a JWT and user info
   * were previously saved (e.g., from a previous login session). If found, it
   * updates state so the user remains logged in on page refresh.
   */
  useEffect(() => {
    // Retrieve JWT; Retrieve user object as a JSON string
    const storedToken = localStorage.getItem("jwt");   
    const storedUser = localStorage.getItem("user"); 
    if (storedToken && storedUser) {
      setToken(storedToken);                   // Set token state
      setUser(JSON.parse(storedUser));         // Parse user string and set user state
    }
  }, []); // Empty dependency array → runs only once on component mount
  /**
   * 
login function
   * Called after successful login (e.g., from LoginSuccess component).
   *
   * Stores the JWT token and user information in localStorage,
   * and also updates the component state so the entire app knows
   * the user is now logged in.
   *
   * @param {string} jwt - The JWT token returned by the server
   * @param {object} userInfo - An object containing user info (name, email, etc.)
   */

  const login = (jwt, userInfo) => {
    localStorage.setItem("jwt", jwt);                       // Save token persistently
    localStorage.setItem("user", JSON.stringify(userInfo)); // Save user as a string
    setToken(jwt);                                          // Update state
    setUser(userInfo);
  };
  /**
   * 
logout function
   * Clears user session data from both localStorage and app state.
   *
   * This function should be called when the user clicks "Logout".
   */
  const logout = () => {
    localStorage.removeItem("jwt");     // Remove stored JWT
    localStorage.removeItem("user");    // Remove stored user info
    setToken(null);                     // Reset app state
    setUser(null);
  };
  /**
   * 
Context value object:
   * This object is made available to any component that uses AuthContext.
   * - user: current user object or null
   * - token: JWT string or null
   * - login(): function to log in and store credentials
   * - logout(): function to log out and clear session
   * - isAuthenticated: true if token exists, false otherwise
   * 
A double negation (!!) forces a boolean
   * 
   *
 (!! token) is either true or false
   * A user is considered authenticated if a non-null JWT token currently
   * stored in state.
   */
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token // Converts truthy token into boolean true
  };
  return (
    // Provide the `value` object to all nested children
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
 }
 export default AuthProvider;