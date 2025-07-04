// File: controllers/authController.js
 // Import Google's OAuth2 client to verify Google ID tokens
 import { OAuth2Client } from "google-auth-library";
 // Import jsonwebtoken to issue and verify signed JWTs
 import jwt from "jsonwebtoken";
 // Import the Mongoose User model to lookup or create user records in MongoDB
 import User from "../models/User.js";
 // Initialize the Google OAuth2 client using the client ID from your .env file
 const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
 /**
 * Controller: handleGoogleLogin
 *
 * Handles user login with a Google ID token.
 * The client (React frontend) sends a Google ID token after the user logs in with Google.
 * This token is verified on the server, and if valid, a new signed JWT is returned.
 *
 * @route   POST /api/auth/google
 * @access  Public (called from the frontend after login)
 */
 export const handleGoogleLogin = async (req, res) => {
  const { credential } = req.body;      // The Google ID token sent from the frontend
  try {
    /**
     * Use Google's OAuth2 client to verify the integrity of the ID token.
     * This ensures that the token:
     *   - Was issued by Google
     *   - Is valid (not expired, not tampered with)
     *   - Was issued for your app (checked using the "audience" field)
     *
     * 
credential: This is the Google ID token the frontend received after the user signed
     *             in via Google. It's a compact JWT string that proves the user’s identity.
     *
     * 
verifyIdToken(): This method decodes the token, verifies its signature, checks its
     *                  expiration, and validates that it was issued for your app.
     *
     * 
audience: process.env.GOOGLE_CLIENT_ID: This ensures that only tokens created for your 
     *           app are accepted. If the frontend used a different client ID, this check 
     *           would fail.
     *
     * 
ticket: If verification is successful, this object contains a method getPayload() that 
     *         gives you access to the decoded user profile.
     */
    const ticket = await client.verifyIdToken({
      idToken: credential,                        // The ID token received from the frontend
      audience: process.env.GOOGLE_CLIENT_ID
    });
    // Extract the payload (user profile data) from the token
    const payload = ticket.getPayload();
    const { sub, name, email, picture } = payload;
    /**
     * Check if the user already exists in MongoDB using their Google ID (sub)
     * - `sub` is a unique identifier for the user provided by Google
     * - If not found, create a new user document
     */
    let user = await User.findOne({ googleId: sub });
    if (!user) {

      user = await User.create({ googleId: sub, name, email, picture });
    }
    /**
     * Sign a new JSON Web Token (JWT) for the user.
     *
     * Syntax:
     *   jwt.sign(payload, secretOrPrivateKey, [options])
     *
     * - Payload: the data you want to encode inside the token
     *   Never include sensitive info like passwords.
     *   In this case, we include:
     *     • userId: MongoDB _id (for ownership checks)
     *     • name and email for convenience in frontend display
     *
     * - Secret: a strong random string used to sign the token (defined in .env)
     *   Only the server knows this secret. It uses HMAC SHA-256 to create a signature.
     *
     * - Options: 
     *     • expiresIn: sets the token expiration time (e.g., 1h = one hour)
     *       After this time, the token becomes invalid and the client must re-authenticate.
     */
    const token = jwt.sign(
      {
        userId: user._id,     // Required to identify resource ownership
        name: user.name,      // Optional user display info for frontend
        email: user.email
      },
      process.env.JWT_SECRET, // Signing key (keep this secret)
      { expiresIn: "1h" }     // Token is valid for 1 hour
    );
    /**
     * Respond with:
     * - token: the signed JWT string
     * - user: public profile info for display on the frontend
     *
     * The frontend will store this token in localStorage and send it with every API request
     */
    res.json({
      token,
      user: { name, email, picture }
    });
  } catch (err) {
    // Handle failed token verification or internal server errors
    res.status(401).json({
      message: "Invalid Google token",
      error: err.message
    });
  }
 };