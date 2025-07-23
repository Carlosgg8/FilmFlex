import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Content from "../components/profile/content/Content";
import PostModal from '../components/modals/PostModal/PostModal.jsx'
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import NavBar from "../components/NavBar.jsx";



function ProfilePage() {
    // State to control modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to store the selected post
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchValue, setSearchValue] = useState("");

     // Handler to open the modal with a selected post
    const handleSelectPost = (post) => {
        setSelectedPost(post);  // Store the clicked post
        setIsModalOpen(true);   // Show the modal
        document.body.style.overflow = "hidden"
    };

    // Handler to close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);  // Clear selected post
        document.body.style.overflow = "auto"
    };

    function onSearchValueChange(newValue){
        setSearchValue(newValue);
    }

    return (
        <>
        <NavBar/>
        <ProfileHeader/>
        <Content handleSelectPost={handleSelectPost} />
        {isModalOpen && <PostModal post={selectedPost} onClose={handleCloseModal} />}
        </>
    );
    }

export default ProfilePage;