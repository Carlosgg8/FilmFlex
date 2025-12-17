import React from "react";
import "./ProfilePost.css";

import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";

/**
 * Individual post component displayed in profile grid - shows poster image with like/comment overlay
 */
export default function ProfilePost({ post, postHandler }) {
  const handleClick = () => {
    // Create an enhanced post object with both images in order
    const postWithImages = {
      ...post,
      images: [post.poster, post.reactionIMG].filter(Boolean) // poster first, then reactionIMG
    };
    postHandler(postWithImages);
  };

  return (
    <div onClick={handleClick} className="post-container">
      <div className="post">
        {/* Display poster as img tag for better compatibility */}
        <img
          className="post-image"
          src={post.poster}
          alt="Post"
        />
      </div>
      {/* Hover overlay showing engagement stats */}
      <div className="post-overlay">
        <span>
          <Favorite/>
          {Array.isArray(post.likes) ? post.likes.length : (post.likes || 0)}
        </span>
        <span>
          <ModeComment/>
          {post.comments?.length || 0}
        </span>
      </div>
    </div>
  );
}

