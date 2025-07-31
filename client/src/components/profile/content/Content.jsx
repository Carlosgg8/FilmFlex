import React, { useEffect,useState } from "react";
import './Content.css';
import { selectPost } from "../../../utils/postHandlers"; 

import ProfilePost from "../posts/ProfilePost";

export default function Content({ handleSelectPost, userId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userId) return; // Don't fetch if userId is undefined
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, [userId]);

  return (
  <div className="content-container">
    <div className="content">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <ProfilePost 
            key={index} 
            post={post} 
            postHandler={handleSelectPost}
          />
        ))
      ) : (
        <div className="no-posts-placeholder">
          {/* Either a message or a styled gray grid */}
          <p>No posts yet.</p>
        </div>
      )}
    </div>
  </div>
);
} 