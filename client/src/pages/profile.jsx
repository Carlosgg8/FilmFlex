import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams  } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/authContext";

import Content from "../components/profile/content/Content";
import PostModal from '../components/modals/PostModal/PostModal.jsx'
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import NavBar from "../components/NavBar.jsx";

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
                userId={user?.id || user?.userId} 
                handleSelectPost={handleSelectPost}
                onPostCountChange={onPostCountChange}
            />
        </div>
        {/* Conditionally render post modal */}
        {isModalOpen && <PostModal post={selectedPost} onClose={handleCloseModal} />}
    </>
);
}

export default ProfilePage;