import mongoose from "mongoose";

// Define schema for movie review posts
const postSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: false
    }, // Reference to the user who created the post

    movieId: { 
      type: String, 
      required: true 
    }, // TMDB movie ID

    imageURL: { 
      type: String, 
      required: true 
    }, // URL to uploaded image 

    caption: { 
      type: String, 
      trim: true, 
      maxlength: 500 
    }, // Optional text the user adds

    rating: { 
      type: Number, 
      required: true 
    }, // Star rating given by the user (e.g. 1-5)
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Create the Post model
const Post = mongoose.model("Post", postSchema);

// Export the model
export default Post;