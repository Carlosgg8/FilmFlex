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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from JWT token
    const { name, bio, location, website, picture } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (picture !== undefined) updateData.picture = picture;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-email'); // Exclude sensitive data

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

/**
 * @route   POST /api/user/set-username
 * @desc    Set username for users who don't have one (typically Google auth users)
 * @access  Private (requires JWT)
 */
export const setUsername = async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from JWT token
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Update user with new username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { username: username.trim() } },
      { new: true, runValidators: true }
    ).select('-email'); // Exclude sensitive data

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user with userId field (mapped from _id) for frontend compatibility
    res.status(200).json({ 
      message: "Username set successfully", 
      user: {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        picture: updatedUser.picture,
        username: updatedUser.username,
        bio: updatedUser.bio,
        followers: updatedUser.followers,
        following: updatedUser.following
      }
    });
  } catch (error) {
    console.error('Set username error:', error);
    res.status(500).json({ message: "Failed to set username", error: error.message });
  }
};
