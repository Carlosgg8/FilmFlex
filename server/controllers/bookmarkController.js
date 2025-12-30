import Post from "../models/Post.js";
import User from '../models/User.js'; 

/**
 * @route   POST /api/users/saved/:postId
 * @desc    Toggle save/unsave a post
 * @access  Private
 */
export const toggleSavePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if post is already saved
        const isSaved = user.savedPosts.some(id => id.toString() === postId.toString());

        if (isSaved) {
            // Unsave: Remove from savedPosts
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId.toString());
        } else {
            // Save: Add to savedPosts
            user.savedPosts.push(postId);
        }

        await user.save();

        res.status(200).json({ 
            saved: !isSaved,
            savedPosts: user.savedPosts 
        });
    } catch (error) {
        console.error('Toggle save post error:', error);
        res.status(500).json({ message: "Failed to save/unsave post", error: error.message });
    }
};

/**
 * @route   GET /api/users/saved
 * @desc    Get all saved posts for current user
 * @access  Private
 */
export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Find user and populate saved posts with comments and their users
        const user = await User.findById(userId).populate({
            path: 'savedPosts',
            populate: {
                path: 'comments.user',
                select: 'username picture'
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out null posts (in case some were deleted)
        const validPosts = user.savedPosts.filter(post => post !== null);

        res.status(200).json(validPosts);
    } catch (error) {
        console.error('Get saved posts error:', error);
        res.status(500).json({ message: "Failed to fetch saved posts", error: error.message });
    }
};
