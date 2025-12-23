import Post from "../models/Post.js";

import User from '../models/User.js'; 


/**
 * @route   GET /api/posts
 * @desc    Fetch all posts (filters can be added later if needed)
 * @access  Public
 */
export const getAllEntries = async (req, res) => {
  try {
    const entries = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Unable to fetch posts" });
  }
};

/**
 * @route   GET /api/posts/:id
 * @desc    Fetch a single post by ID
 * @access  Public
 */
export const getEntryById = async (req, res) => {
  try {
    const entry = await Post.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Unable to retrieve post" });
  }
};

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private
 */
export const createEntry = async (req, res) => {
  try {

    console.log('=== CREATE ENTRY DEBUG ===');
    console.log('Request headers:', req.headers);
    console.log('Request body keys:', Object.keys(req.body || {}));
    console.log('Body.reactionIMG exists:', !!req.body?.reactionIMG);
    console.log('Body.reactionIMG type:', typeof req.body?.reactionIMG);
    console.log('Body.reactionIMG length:', req.body?.reactionIMG?.length || 0);
    console.log('Body.poster exists:', !!req.body?.poster);
    console.log('Body.rating:', req.body?.rating);
    console.log('Body.caption:', req.body?.caption);
    console.log('User from JWT:', req.user);
    console.log('==========================');

     const { poster, reactionIMG, caption, rating } = req.body;

    // Get user info to populate username and profile image
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newEntry = new Post({
      user: req.user.userId,
      username: user.username, // Add username
      user_profile_image_url: user.picture, // Add profile image URL
      poster,
      reactionIMG,
      rating,
      caption,
      createdAt: new Date()
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private
 */
export const updateEntry = async (req, res) => {
  try {
    const { movieId, imageURL, caption, rating } = req.body;
    const entry = await Post.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "No entry found" });
    }

    if (entry.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (movieId) entry.movieId = movieId;
    if (imageURL) entry.imageURL = imageURL;
    if (caption) entry.caption = caption;
    if (rating) entry.rating = rating;

    const updatedEntry = await entry.save();
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: "Failed to update entry" });
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Private
 */
export const deleteEntry = async (req, res) => {
  try {
    const entry = await Post.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "No entry found" });
    }

    if (entry.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: "Entry deletion failed", error: error.message });
  }
};

/* function to get the users post and dicplay them on their (there?) profile*/
export const getEntriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const entries = await Post.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user posts", error });
  }
};

/**
 * @route   POST /api/posts/:id/like
 * @desc    Like or unlike a post
 * @access  Private
 */
export const likeEntry = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.userId;

    // Handle backward compatibility: if likes is a number, convert to array
    if (typeof post.likes === 'number') {
      post.likes = [];
    } else if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    // Check if user has liked (convert ObjectIds to strings for comparison)
    const userIndex = post.likes.findIndex(id => id.toString() === userId.toString());

    if (userIndex > -1) {
      // User already liked, remove like
      post.likes.splice(userIndex, 1);
    } else {
      // User hasn't liked, add like
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: "Failed to like post", error: error.message });
  }
};

/**
 * @route   POST /api/posts/:id/comment
 * @desc    Add a comment to a post
 * @access  Private
 */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    // authMiddleware sets req.user.userId
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create comment
    const comment = {
      message: message,
      from: userId.toString(),
      profile_name: user.username || user.name,
      profile_image_url: user.picture || 'https://via.placeholder.com/150',
      likes: [], // Changed to empty array
      createdAt: new Date()
    };

    // Add to post
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

/**
 * @route   POST /api/posts/:postId/comments/:commentId/like
 * @desc    Like or unlike a comment
 * @access  Private
 */
export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.userId;

    // First, check if user already liked this comment
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasLiked = comment.likes && comment.likes.some(id => id.toString() === userId.toString());

    // Use atomic operation to avoid version conflicts
    let updatedPost;
    if (hasLiked) {
      // Unlike: remove userId from likes array
      updatedPost = await Post.findOneAndUpdate(
        { _id: postId, 'comments._id': commentId },
        { $pull: { 'comments.$.likes': userId } },
        { new: true }
      );
    } else {
      // Like: add userId to likes array
      updatedPost = await Post.findOneAndUpdate(
        { _id: postId, 'comments._id': commentId },
        { $addToSet: { 'comments.$.likes': userId } },
        { new: true }
      );
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: "Failed to like comment", error: error.message });
  }
};