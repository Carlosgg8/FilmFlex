import React, { useRef, useState, useEffect } from "react";
import PostCard from "../components/PostCard.jsx";
import "../styles/feed.css";
import NavBar from "../components/NavBar.jsx";
import { selectPost } from "../utils/postHandlers.js"
import PostModal from "../components/modals/PostModal/PostModal.jsx"


const testPosts = [
  {
    id: 1,
    user: "Alice",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    photoSrc: "andrew.webp",
    caption: "Hello from Alice!",
  },
  {
    id: 2,
    user: "Bob",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    photoSrc: "https://picsum.photos/seed/bob/500/300",
    caption: "Bob's beautiful photo",
  },
  {
    id: 3,
    user: "Cara",
    profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
    photoSrc: "https://picsum.photos/seed/cara/500/300",
    caption: "Cara's day out",
  },
];

const FeedContent = ({ handleSelectPost, posts }) => {
  return (
    <div className="feed-content">
      <div className="feed-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onCommentClick={handleSelectPost} />
        ))}
      </div> 
    </div>
  );
};


function Feed() {
  const [posts, setPosts] = useState(testPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

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
      <NavBar />
      <div className="feed-container">
        <FeedContent handleSelectPost={handleSelectPost} posts={posts} />
      </div>
      {isModalOpen && <PostModal post={selectedPost} onClose={handleCloseModal} />}
    </>
  );
}
export default Feed;



