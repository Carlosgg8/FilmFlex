import React, { useEffect,useState } from "react";
import './Content.css';
import { selectPost } from "../../../utils/postHandlers"; 
import NoPost from "./NoPost";

import ProfilePost from "../posts/ProfilePost";

/**
 * Component that displays a user's posts in a grid layout
 */
export default function Content({ userId, handleSelectPost, onPostCountChange }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
  if (!userId) {
    console.log('userId is not available yet:', userId);
    return; // Don't fetch if userId is undefined
  }
  
  // Fetch posts for the specific user
  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Ensure data is always an array
      setPosts(Array.isArray(data) ? data : []);
      // Update parent component with post count
      onPostCountChange(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
      onPostCountChange(0);
    }
  };
  
  fetchPosts();
}, [userId, onPostCountChange]);

  return (
  <div className="content-container">
    <div className="content">
      {posts.length > 0 ? (
        // Render posts in grid layout
        posts.map((post, index) => (
          <ProfilePost 
            key={index} 
            post={post} 
            postHandler={handleSelectPost}
          />
        ))
      ) : (
        // Show "no posts" message when user has no posts
        <div className="no-post-grid-item"> 
          <NoPost />
        </div>
      )}
    </div>
  </div>
);
} 