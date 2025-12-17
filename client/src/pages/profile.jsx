import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams  } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/authContext";

import Content from "../components/profile/content/Content";
import PostModal from '../components/modals/PostModal/PostModal.jsx'
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import NavBar from "../components/NavBar.jsx";
import { postAPI } from "../services/api.js";

import '../components/profile/content//Content.css'

/**
 * Profile page component that displays user profile and posts with modal interactions
 */
function ProfilePage() {
    const { userId } = useParams();  
    const { user } = useContext(AuthContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [postCount, setPostCount] = useState(0); 
    const [posts, setPosts] = useState([]);
    
    // Handle post selection and modal opening
    const handleSelectPost = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    // Handle modal closing and restore scrolling
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
        document.body.style.overflow = "auto";
    };

    // Handle search value changes
    const onSearchValueChange = (newValue) => {
        setSearchValue(newValue);
    };

    // Update post count when posts are loaded/changed
    const onPostCountChange = (count) => {
        setPostCount(count);
    };

    const handleAddComment = (postId, newComment) => {
        setPosts(prevPosts => 
        prevPosts.map(post => {
            if (post.id === postId) {
                const updatedPost = {
                    ...post,
                    comments: [...(post.comments || []), newComment]  
                };
                    // selectedPost if it's the same post
                    if (selectedPost && selectedPost.id === postId) {
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

    // Handle posts being loaded from Content component
    const handlePostsLoaded = (loadedPosts) => {
        setPosts(loadedPosts);
    };

    return (
    <>
        <NavBar />
        {/* Main profile page container */}
        <div className="profile-page-container"> 
            <ProfileHeader 
                user={user} 
                postCount={postCount} 
            />
            {/* Content area displaying user's posts */}
            <Content 
                userId={userId || user?.id || user?.userId} 
                handleSelectPost={handleSelectPost}
                onPostCountChange={onPostCountChange}
                posts={posts} 
                onPostsLoaded={handlePostsLoaded} 
            />
        </div>
        {/* Conditionally render post modal */}
        {isModalOpen && <PostModal 
            post={selectedPost}
            onClose={handleCloseModal} 
            onAddComment={handleAddComment}
            onLikePost={handleLikePost}
            user={user} // Pass the logged-in user
        />}
    </>
);
}

export default ProfilePage;