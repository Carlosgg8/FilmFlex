import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import "../styles/feed.css";
import NavBar from "../components/NavBar.jsx";
import { selectPost } from "../utils/postHandlers.js"
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



function Feed() {
  const [posts, setPosts] = React.useState(testPosts);

  // no need for useEffect just using test data

  return (
    <>
    <NavBar />
    <div className="feed-container">
        <div className="feed-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Feed;



