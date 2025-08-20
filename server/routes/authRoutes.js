 // File: routes/authRoutes.js
 // Defines authentication routes for the ThoughtStream app using Google OAuth2 via Passport.js
 import express from "express";
 import passport from "passport";
 import { handleGoogleLogin } from "../controllers/authController.js";
 // Create a new Express router instance
 const router = express.Router();
 /**
 * @route   GET /auth/google
 * @desc    Initiates the OAuth2 login flow by redirecting the user to Google’s consent screen
 * 
 * - This route is triggered when a user clicks Login with Google.
 * - The passport.authenticate("google", ...) middleware initiates the OAuth flow using the
 *   configured Google strategy
 * - The scope defines what data we want access to. In this case:
 *     - "profile": user's basic public info (e.g., name, picture)
 *     - "email": user's primary email address
 * - Google handles the login and asks the user for consent to share this information
 */
 router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]  // Request basic profile info and email from Google
  })
 );
 /**
 * @route   GET /auth/google/callback
 * @desc    Handles the OAuth2 callback from Google after the user logs in and consents.
 * 
 * - Google redirects the user back to this route after login
 * - Passport takes over again to process the response and extract the user’s info
 * - If login fails (e.g., user denies consent), it redirects to /auth/failure
 * - If login is successful, a session is created automatically and the user is authenticated
 * - Replace res.send() with a redirect to a protected page (or frontend)
 */
 router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure"  // Where to go if login fails
  }),
  (req, res) => {
    // If authentication succeeds, Passport attaches user to req.user and session is established
    res.send("Login successful! Session has been created.");
  }
 );

 /**
 * @route   GET /auth/logout
 * @desc    Logs the user out by ending the session and clearing session cookies
 * 
 * - req.logout() is provided by Passport and removes the req.user property
 * - It also destroys the session on the server
 * - Once logout completes, the user is effectively logged out of the application
 * - The session cookie will no longer be sent in future requests
 */
 
 // TODO: Implement the route — router.get(“/logout”, …)
  // Send a message indicating successful logout
  // 


 router.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.send("Logout successful!");
    });
  });
});

/**
 *
 Gracefully handle errors in case of logout failure
 * @route   GET /auth/failure
 * @desc    A simple error handler route for failed logins
 * 
 * - This route is shown if the OAuth flow fails (e.g., user denies access or login 
errors)
 * - Sends an appropriate HTTP 401 (unauthorized) response
 */
 router.get("/failure", (req, res) => {
  res.status(401).send("Login failed.");
 });

 router.post("/google", handleGoogleLogin);   // POST /api/auth/google


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [ { username }, { email } ] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already taken" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({ username, email, password: hashedPassword });
    // Sign JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { userId: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

router.get("/test", (req, res) => {
  res.send("Auth route is working!");
});

router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  
  try {
    // Find user by either username or email
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Sign JWT 
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" } // jwt expires in 30 days
    );
    
    res.json({
      token,
      user: { userId: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

 export default router;

 