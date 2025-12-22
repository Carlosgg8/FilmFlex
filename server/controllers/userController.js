import User from '../models/User.js';

/**
 * @route   GET /api/users/search?q=query
 * @desc    Search for users by username or name
 * @access  Public
 */
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search for users by username only (must have username set)
    const users = await User.find({
      username: { $regex: q, $options: 'i', $exists: true, $ne: null }
    })
    .select('username name picture') // Only return necessary fields
    .limit(10); // Limit to 10 results

    res.status(200).json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: "Failed to search users", error: error.message });
  }
};

/**
 * @route   GET /api/users/:userId
 * @desc    Get user profile by ID
 * @access  Public
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-email'); // Exclude sensitive data
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: "Failed to get user", error: error.message });
  }
};
