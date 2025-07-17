import React, { useEffect } from "react";
import './Content.css';
import { selectPost } from "../../../utils/postHandlers"; 

import posts from "../../../../../server/data/posts/posts.json";
import ProfilePost from "../posts/ProfilePost";

export default function Content({ handleSelectPost }) {

    useEffect(() => {
        console.log(posts);
    }, []);

    return (
      <div className="content-container">
        <div className="content">
          {posts.map((post, index) => (
            <ProfilePost 
              key={index} 
              post={post} 
              postHandler={handleSelectPost}
            />
          ))}
        </div>
      </div>
    );
}