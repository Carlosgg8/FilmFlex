import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    name: String,
    email: String,
    picture: String,

    password: { type: String, required: function() {
      return !this.googleId; // Required only if not Google user
    }},

    // New Fields for Profile Page
    username: { type: String, unique: true, sparse: true }, // can be user-generated later
    bio: { type: String, maxlength: 150 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);