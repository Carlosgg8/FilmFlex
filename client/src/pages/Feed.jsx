import React, { useRef, useState, useEffect, useContext } from "react";
import PostCard from "../components/PostCard.jsx";
import "../styles/feed.css";
import NavBar from "../components/NavBar.jsx";
import { selectPost } from "../utils/postHandlers.js"
import { AuthContext } from "../context/authContext";
import PostModal from "../components/modals/PostModal/PostModal.jsx"

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
    likes: 47,
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
    likes: 32,
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
const FeedContent = ({ handleSelectPost, posts }) => {
  return (
    <div className="feed-content">
      <div className="feed-grid">
        {/* Map through posts to create PostCard components */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onCommentClick={handleSelectPost} />
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user } = useContext(AuthContext);

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
        if (post.id === postId) {
          const updatedPost = {
            ...post,
            comments: [...(post.comments || []), newComment] // Safe handling of undefined comments
          };
          // Update selectedPost if it's the same post
          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updatedPost);
          }
          return updatedPost;
        }
        return post;
      })
    );
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

  return (
    <>
      
      <div className="feed-container">
        <FeedContent handleSelectPost={handleSelectPost} posts={posts} />
      </div>
      {/* Conditionally render post modal */}
      {isModalOpen && (
        <PostModal 
          post={selectedPost} 
          onClose={handleCloseModal}
          onAddComment={handleAddComment} 
          user={user} 
        />
      )}
    </>
  );
}
export default Feed;



