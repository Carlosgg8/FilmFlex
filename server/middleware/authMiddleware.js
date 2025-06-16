 // File: middleware/authMiddleware.js
 // Middleware function to protect routes in the ThoughtStream app 
// Ensures that only authenticated users can access certain API endpoints
 /**
 * Middleware to check if a user is authenticated.
 * 
 * Use Passport's req.isAuthenticated() method, which checks:
 *   - Whether the user has an active session
 *   - Whether req.user has been set by Passport - the user has logged in
 * 
 * Apply this middleware to any route available to logged-in users only.
 * If the user is authenticated, the middleware calls next() to allow 
 * the request to proceed. If the user is not authenticated, it returns a 
 * 401 Unauthorized response.
 * 
 * Example usage in a route:
 *   router.get("/private", ensureAuthenticated, (req, res) => {
 *     res.send("This is a protected route");
 *   });
 * 
 * @param {object} req - Express request object, extended by Passport
 * @param {object} res - Express response object
 * @param {function} next - Function to pass control to the next middleware
 * or route handler
 */
 export const ensureAuthenticated = (req, res, next) => {
 // TODO: Implement the function
    if(req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Not authorized" });
 };