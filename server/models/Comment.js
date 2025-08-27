import mongoose from "mongoose"; 

const commentSchema = new mongoose.Schema(
  {
    // Post this comment belongs to
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },

    // User who wrote the comment (optional if you allow anonymous)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    // Actual comment text
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      required: true
    },

    // Snapshot of the user's display name at the time of commenting
    profile_name: {
      type: String
    },

    // Snapshot of user avatar URL (optional)
    profile_image_url: {
      type: String
    },

    // Simple like counter
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;