import React, { useRef, useState, useEffect, useContext } from "react";
import PostCard from "../components/PostCard.jsx";
import "../styles/feed.css";
import NavBar from "../components/NavBar.jsx";
import { selectPost } from "../utils/postHandlers.js"
import { AuthContext } from "../context/authContext";
import PostModal from "../components/modals/PostModal/PostModal.jsx"
import { postAPI } from "../services/api.js";

/**
 * Component that renders the feed of post cards
 */
const FeedContent = ({ handleSelectPost, handleLikePost, posts }) => {
  return (
    <div className="feed-content">
      <div className="feed-grid">
        {/* Map through posts to create PostCard components */}
        {posts.map((post) => (
          <PostCard key={post._id || post.id} post={post} onCommentClick={handleSelectPost} onLikePost={handleLikePost} />
        ))}
      </div> 
    </div>
  );
};

/**
 * Main feed page component that manages posts and modal state
 */
function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postAPI.getAllPosts();
        if (response.data && response.data.length > 0) {
          setPosts(response.data);
        }
        // If no posts from API, keep using test posts
      } catch (err) {
        console.error('Error fetching posts:', err);
        // Keep using test posts on error
      }
    };

    fetchPosts();
  }, []);

  // Handle post selection to open modal
  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Handle closing modal and clearing selected post
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Handle adding comments to posts
  const handleAddComment = async (postId, newComment) => {
    // Check if this is a test post (id is a number, not ObjectId)
    const isTestPost = typeof postId === 'number' || (typeof postId === 'string' && /^\d+$/.test(postId));
    
    if (isTestPost) {
      // Handle test post comments locally (no API call)
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if ((post._id || post.id) === postId) {
            const updatedPost = {
              ...post,
              comments: [...(post.comments || []), newComment] // Safe handling of undefined comments
            };
            // Update selectedPost if it's the same post
            if (selectedPost && (selectedPost._id || selectedPost.id) === postId) {
              setSelectedPost(updatedPost);
            }
            return updatedPost;
          }
          return post;
        })
      );
      return;
    }

    // Handle real posts with API call
    try {
      const response = await postAPI.addComment(postId, { message: newComment.message });
      const updatedPost = response.data;
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            // Update selectedPost if it's the same post
            if (selectedPost && selectedPost._id === postId) {
              setSelectedPost(updatedPost);
            }
            return updatedPost;
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Handle liking a post
  const handleLikePost = async (postId) => {
    try {
      const response = await postAPI.likePost(postId);
      const updatedLikes = response.data.likes;
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            const updatedPost = {
              ...post,
              likes: updatedLikes
            };
            // Update selectedPost if it's the same post
            if (selectedPost && selectedPost._id === postId) {
              setSelectedPost(updatedPost);
            }
            return updatedPost;
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Handle deleting a post
  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  // Lock scroll when modal is open
  useEffect(() => {
  if (isModalOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [isModalOpen]);

  if (loading) {
    return <div className="feed-container">Loading posts...</div>;
  }

  if (error) {
    return <div className="feed-container">Error: {error}</div>;
  }

  return (
    <>
      
      <div className="feed-container">
        <FeedContent handleSelectPost={handleSelectPost} handleLikePost={handleLikePost} posts={posts} />
      </div>
      {/* Conditionally render post modal */}
      {isModalOpen && (
        <PostModal 
          post={selectedPost} 
          onClose={handleCloseModal}
          onAddComment={handleAddComment}
          onLikePost={handleLikePost}
          onDeletePost={handleDeletePost}
          user={user} 
        />
      )}
    </>
  );
}
export default Feed;



