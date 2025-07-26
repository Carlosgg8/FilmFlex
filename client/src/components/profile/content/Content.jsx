import React, { useEffect,useState } from "react";
import './Content.css';
import { selectPost } from "../../../utils/postHandlers"; 

import ProfilePost from "../posts/ProfilePost";

export default function Content({ handleSelectPost, userId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const response = await fetch(`/api/posts/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    };

    fetchPosts();
}, [userId]);

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