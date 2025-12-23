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

export const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params; // Target user to follow/unfollow
    const currentUserId = req.user.userId; // Logged in user

    if (currentUserId === userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if already following
    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow: remove from both arrays
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { followers: currentUserId } });
    } else {
      // Follow: add to both arrays
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: userId } });
      await User.findByIdAndUpdate(userId, { $addToSet: { followers: currentUserId } });
    }

    // Get updated counts
    const updatedTargetUser = await User.findById(userId).select('followers following');
    
    res.status(200).json({
      isFollowing: !isFollowing,
      followerCount: updatedTargetUser.followers.length,
      followingCount: updatedTargetUser.following.length
    });
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({ message: "Failed to toggle follow", error: error.message });
  }
};
