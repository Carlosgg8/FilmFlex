// File: config/passport.js
 // Import the Passport.js authentication middleware
 import passport from "passport";
 // Import the Google OAuth2 strategy and rename it for clarity
 import { Strategy as GoogleStrategy } from "passport-google-oauth20";
 // Import the Mongoose User model to query the database
 import User from "../models/User.js";
 /**
 * Configure the Google OAuth2 strategy for Passport middleware.
 * This tells Passport how to handle authentication with Google.
 */
 passport.use(
  new GoogleStrategy(
    {
      // These values are read from the .env file
      clientID: process.env.GOOGLE_CLIENT_ID,           // Google client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,   // Google client secret
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Route to handle Google response
    },
    /**
     * Callback function runs after user logs in with Google and grants permission.
     * @param {string} accessToken - Token used to access Google APIs (not used here)
     * @param {string} refreshToken - Token to refresh accessToken (not used here)
     * @param {object} profile - Contains user information returned by Google
     * @param {function} done - Callback to pass control back to Passport
     */
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find an existing user in the database by their Google ID
        let user = await User.findOne({ googleId: profile.id });
        // If the user doesn't exist, create a new one
        if (!user) {
          user = await User.create({
            googleId: profile.id,                    // Unique ID provided by Google
            name: profile.displayName,               // Full name from Google profile
            email: profile.emails[0].value,          // Primary email address
            picture: profile.photos[0].value,        // Profile picture URL
          });
        }
        // Pass the user object to Passport (authentication successful)
        done(null, user);
      } catch (err) {
        // Pass the error to Passport (authentication failed)
        done(err, null);
      }
    }
  )
 );
/**
 * Serialize user into the session.
 * Stores the user’s ID in the session cookie.
 * This function is called by Passport once, after the user logs in successfully.
 *
 * In our case, we choose to store only the user's unique MongoDB ID (user.id).
 * This keeps the session cookie lightweight while still providing a reference
 * to the full user object stored in the database.
 *
 * The done() function is a Passport callback used to signal that serialization 
 * is complete.
 * It takes two arguments: an error (null here, since no error occurred) and 
 * the user ID to store.
 * 
 * This user ID will be stored on the session and used later in deserialization.
 * 
 * @param {object} user - The full Mongoose user object after successful login
 * @param {function} done - Callback to pass control back to Passport
 */
 passport.serializeUser((user, done) => {
  done(null, user.id);                  // Only store the user ID in the session
 });
 /**
 * Deserialize user from the session.
 *
 * This function runs **on every authenticated request** after login.
 * When the session cookie is sent from the browser, Passport reads the stored user 
 * ID from it and calls this function to fetch the full user object from the database.
 *
 * This is crucial because we typically only store a lightweight identifier (user ID)
 * in the session, not the whole user object.
 *
 * Passport will then attach the fully fetched user object to req.user, making
 * it available in any route handler that needs to check who the logged-in user is.
 *
 * Again, done() is used to complete the deserialization step, passing either 
 * an error or the user object.
 * 
 * @param {string} id - The user ID that was stored in the session
 * @param {function} done - Callback to complete the deserialization process
 */
 passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);       // Fetch full user from DB
    done(null, user);                           // Attach to req.user
  } catch (err) {
    done(err, null);                            // Handle errors gracefully
  }
 });