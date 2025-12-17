import mongoose from "mongoose"; 

// Define schema for movie review posts
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    username: {
      type: String,
      required: true
    },

    user_profile_image_url: {
      type: String,
      required: false
    },

    poster: {
      type: String,
      required: true
    },

    reactionIMG: { // Fixed: consistent naming with test data
      type: String,
      required: true
    },

    // Post caption
    caption: {
      type: String,
      trim: true,
      maxlength: 500
    },

    // Movie rating
    rating: {
      type: Number,
      required: true
    },

    // Likes as array of user IDs
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    // Array of embedded comments (matches test data structure)
    comments: [
      {
        message: String, // Fixed: matches test data field name
        from: String, // Fixed: matches test data field name
        profile_name: String,
        profile_image_url: String,
        likes: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

// Create the Post model
const Post = mongoose.model("Post", postSchema);

// Export the model
export default Post;