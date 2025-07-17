import mongoose from "mongoose";

// Define schema for movie review posts
const postSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: false
    },

    user_profile_image_url: {
      type: String,
      required: false, 
    },

    movieId: { 
      type: String, 
      required: true 
    },

    imageURL: { 
      type: String, 
      required: true 
    },

    caption: { 
      type: String, 
      trim: true, 
      maxlength: 500 
    },

    rating: { 
      type: Number, 
      required: true 
    },

    // Number of likes
    likes: {
      type: Number,
      default: 0
    },

    // Array of comments
    comments: [
      {
        message: String,
        from: String,
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