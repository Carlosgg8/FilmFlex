import React, { useRef, useState, useEffect, useContext } from "react";
import PostCard from "../components/PostCard.jsx";
import "../styles/feed.css";
import NavBar from "../components/NavBar.jsx";
import { selectPost } from "../utils/postHandlers.js"
import { AuthContext } from "../context/authContext";
import PostModal from "../components/modals/PostModal/PostModal.jsx"
import { postAPI } from "../services/api.js";

// Faek data for testing
const testPosts = [
  {
    id: 1,
    user: "Alice",
    user_profile_image_url: "https://randomuser.me/api/portraits/women/1.jpg",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", // Dune poster
    reactionIMG: "https://picsum.photos/seed/alice-reaction/400/600", // Fixed: matches schema field name
    rating: 5,
    caption: "Absolutely loved Dune! The cinematography was breathtaking and Hans Zimmer's score gave me chills. This is how you adapt a beloved book!",
    likes: [], // Changed to array
    comments: [
      {
      message: "I totally agree! Best sci-fi movie in years", 
      profile_name: "Bob",  
      profile_image_url: "https://randomuser.me/api/portraits/men/2.jpg"
      }
    ]
  },
  {
    id: 2,
    user: "Bob",
    user_profile_image_url: "https://randomuser.me/api/portraits/men/2.jpg",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", // Spider-Man poster
    reactionIMG: "https://picsum.photos/seed/bob-reaction/400/600", // Fixed: matches schema field name
    rating: 4,
    caption: "Spider-Man: No Way Home was pure nostalgia! Seeing all three Spider-Men together was a childhood dream come true. Some plot holes but who cares!",
    likes: [], // Changed to array
    comments: [
      { 
      message: "The desert scenes were incredible", 
      profile_name: "Cara", 
      profile_image_url: "https://randomuser.me/api/portraits/women/3.jpg",
      }
    ]
  }
];

console.log("Raw test data:");
testPosts.forEach(post => {
  post.comments.forEach(comment => {
    console.log(`Message: "${comment.message}"`);
    console.log(`Message length: ${comment.message.length}`);
    console.log(`Last character: "${comment.message.slice(-1)}"`);
  });
});

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
  const [posts, setPosts] = useState(testPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch posts on component mount
  // Fetch posts on component mount
  useEffect(() => {
    // Temporarily disabled - keeping test posts for development
    /*
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
    */
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
  const handleAddComment = (postId, newComment) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          const updatedPost = {
            ...post,
            comments: [...(post.comments || []), newComment] // Safe handling of undefined comments
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
  };

  // Handle liking a post
  const handleLikePost = async (postId) => {
    // Check if this is a test post (id is a number, not ObjectId)
    const isTestPost = typeof postId === 'number' || (typeof postId === 'string' && /^\d+$/.test(postId));
    
    if (isTestPost) {
      // Handle test post likes locally (no API call)
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if ((post._id || post.id) === postId) {
            const currentLikes = Array.isArray(post.likes) ? post.likes : [];
            const userId = user?.userId;
            
            // Check if user already liked
            const userIndex = currentLikes.findIndex(id => id.toString() === userId?.toString());
            let newLikes;
            
            if (userIndex > -1) {
              // Unlike: remove user from likes
              newLikes = [...currentLikes];
              newLikes.splice(userIndex, 1);
            } else {
              // Like: add user to likes
              newLikes = [...currentLikes, userId];
            }
            
            const updatedPost = {
              ...post,
              likes: newLikes
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
          user={user} 
        />
      )}
    </>
  );
}
export default Feed;



