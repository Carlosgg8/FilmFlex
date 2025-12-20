import React, { useEffect,useState } from "react";
import './Content.css';
import { selectPost } from "../../../utils/postHandlers"; 
import { postAPI } from "../../../services/api.js";

import ProfilePost from "../posts/ProfilePost";
import NoPost from "./NoPost";

/**
 * Component that displays a user's posts in a grid layout
 */
export default function Content({ userId, handleSelectPost, onPostCountChange, posts: parentPosts, onPostsLoaded }) {
  const [posts, setPosts] = useState([]);

  // Fetch posts for the specific user
  const fetchPosts = async () => {
    if (!userId) {
      return; // Don't fetch if userId is undefined
    }
    
    try {
      const response = await postAPI.getPostsByUser(userId);
      const postsArray = Array.isArray(response.data) ? response.data : [];
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

  // Fetch posts when component mounts or userId changes
  useEffect(() => {
    fetchPosts();
  }, [userId]); // Only re-fetch when userId changes

  // Listen for new post creation event
  useEffect(() => {
    const handlePostCreated = () => {
      fetchPosts(); // Refetch posts when new post is created
    };
    
    window.addEventListener('postCreated', handlePostCreated);
    return () => window.removeEventListener('postCreated', handlePostCreated);
  }, [userId]); // Re-register listener when userId changes

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