import React, { useEffect,useState } from "react";
import './Content.css';
import { selectPost } from "../../../utils/postHandlers"; 
import NoPost from "./NoPost";

import ProfilePost from "../posts/ProfilePost";

/**
 * Component that displays a user's posts in a grid layout
 */
export default function Content({ userId, handleSelectPost, onPostCountChange, posts: parentPosts, onPostsLoaded }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userId) {
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
        const postsArray = Array.isArray(data) ? data : [];
        setPosts(postsArray);
        
        // Send posts to parent component
        if (onPostsLoaded) {
          onPostsLoaded(postsArray);
        }
        
        // Update parent component with post count
        onPostCountChange(postsArray.length);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
        onPostCountChange(0);
        
        // Still notify parent even if fetch fails
        if (onPostsLoaded) {
          onPostsLoaded([]);
        }
      }
    };
    
    fetchPosts();
  }, [userId, onPostCountChange, onPostsLoaded]);

  // Use parent posts if available (for comment updates), otherwise use local posts
  const displayPosts = parentPosts && parentPosts.length > 0 ? parentPosts : posts;

  return (
    <div className="content-container">
      <div className="content">
        {displayPosts.length > 0 ? (
          // Render posts in grid layout
          displayPosts.map((post, index) => (
            <ProfilePost 
              key={post._id || index} // Use post._id if available, fallback to index
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