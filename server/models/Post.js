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
      required: false, 
    },

    poster: { 
      type: String, 
      required: true 
    },

    
    reactionIMG: {
      type: String, 
      required: true
    },

    //post caption
    caption: { 
      type: String, 
      trim: true, 
      maxlength: 500 
    },

    //movie rating
    rating: { 
      type: Number, 
      required: true 
    },

    // Number of likes
    likes: {
      type: Number,
      default: 0
    },

    createdAt: Date,

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