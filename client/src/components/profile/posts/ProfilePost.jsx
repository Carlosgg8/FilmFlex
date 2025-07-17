import React from "react";
import "./ProfilePost.css";

import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";

export default function ProfilePost({ post, postHandler }) {
   const handleClick = () => {
    postHandler(post); // This should now log
  };

  return (
    <div onClick={handleClick}
      className="post-container">
        <div className="post">
        <a
            href="#" 
            className="post-image"
            style={{ backgroundImage: `url(${post.imageURL})` }}
        ></a>
        </div>
        <div className="post-overlay">
          <span>
            <Favorite/>
            {post.likes}
          </span>
          <span>
            <ModeComment/>
            {post.comments.length}
          </span>
        </div>
    </div>
  );
}

