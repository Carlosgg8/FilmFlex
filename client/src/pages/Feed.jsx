import React, { useRef, useState, useEffect } from "react";
import PostCard from "../components/PostCard.jsx";
import "../styles/feed.css";
import NavBar from "../components/NavBar.jsx";
import { selectPost } from "../utils/postHandlers.js"
import PostModal from "../components/modals/PostModal/PostModal.jsx"

// Faek data for testing
const testPosts = [
  {
    id: 1,
    user: "Alice",
    user_profile_image_url: "https://randomuser.me/api/portraits/women/1.jpg",
    imageURL: "andrew.webp", // Fallback image
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", // Dune poster
    reactionImg: "https://picsum.photos/seed/alice-reaction/400/600",
    rating: 5,
    caption: "Absolutely loved Dune! The cinematography was breathtaking and Hans Zimmer's score gave me chills. This is how you adapt a beloved book!",
    likes: 47,
    comments: [
      { user: "Bob", text: "I totally agree! Best sci-fi movie in years" },
      { user: "Cara", text: "The desert scenes were incredible" }
    ]
  },
  {
    id: 2,
    user: "Bob",
    user_profile_image_url: "https://randomuser.me/api/portraits/men/2.jpg",
    imageURL: "https://picsum.photos/seed/bob/500/300", // Fallback image
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", // Spider-Man poster
    reactionImg: "https://picsum.photos/seed/bob-reaction/400/600",
    rating: 4,
    caption: "Spider-Man: No Way Home was pure nostalgia! Seeing all three Spider-Men together was a childhood dream come true. Some plot holes but who cares!",
    likes: 32,
    comments: [
      { user: "Alice", text: "Tom Holland killed it!" },
      { user: "Dave", text: "Andrew Garfield was my favorite part" }
    ]
  },
  
];

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
      {isModalOpen && <PostModal post={selectedPost} onClose={handleCloseModal} />}
    </>
  );
}
export default Feed;



