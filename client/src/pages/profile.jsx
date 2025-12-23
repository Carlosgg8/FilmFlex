import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams  } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/authContext";

import Content from "../components/profile/content/Content";
import PostModal from '../components/modals/PostModal/PostModal.jsx'
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import NavBar from "../components/NavBar.jsx";
import { postAPI, userAPI } from "../services/api.js";

import '../components/profile/content//Content.css'

/**
 * Profile page component that displays user profile and posts with modal interactions
 */
function ProfilePage() {
    const { userId } = useParams();  
    const { user } = useContext(AuthContext);

    const [profileUser, setProfileUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [postCount, setPostCount] = useState(0); 
    const [posts, setPosts] = useState([]);
    
    // Fetch profile user data when userId changes
    useEffect(() => {
        const fetchProfileUser = async () => {
            try {
                // If no userId in URL, viewing own profile
                if (!userId) {
                    setProfileUser(user);
                    return;
                }
                
                // Fetch the profile user's data
                const response = await userAPI.getUserById(userId);
                setProfileUser(response.data);
            } catch (err) {
                console.error('Error fetching profile user:', err);
            }
        };

        fetchProfileUser();
    }, [userId, user]);
    
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
                            comments: [...(post.comments || []), newComment]  
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

    // Handle posts being loaded from Content component
    const handlePostsLoaded = (loadedPosts) => {
        setPosts(loadedPosts);
    };

    return (
    <>
        <NavBar />
        {/* Main profile page container */}
        <div className="profile-page-container"> 
            {profileUser && (
                <ProfileHeader 
                    user={profileUser} 
                    postCount={postCount}
                    isOwnProfile={!userId || user?.userId === profileUser?._id}
                    loggedInUser={user}
                />
            )}
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
            onDeletePost={handleDeletePost}
            user={user} // Pass the logged-in user
        />}
    </>
);
}

export default ProfilePage;