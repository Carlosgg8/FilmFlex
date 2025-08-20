import Post from "../models/Post.js";

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

    const newEntry = new Post({
      user: req.user.userId,
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

    await entry.remove();
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Entry deletion failed" });
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