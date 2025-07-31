import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams  } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/authContext";

import Content from "../components/profile/content/Content";
import PostModal from '../components/modals/PostModal/PostModal.jsx'
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import NavBar from "../components/NavBar.jsx";



function ProfilePage() {
    const { userId } = useParams();  
    const { user } = useContext(AuthContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    const handleSelectPost = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
        document.body.style.overflow = "auto";
    };

    const onSearchValueChange = (newValue) => {
        setSearchValue(newValue);
    };

    return (
        <>
            <NavBar />
            <ProfileHeader user={user} /> 
            <Content userId={userId} handleSelectPost={handleSelectPost} />
            {isModalOpen && <PostModal post={selectedPost} onClose={handleCloseModal} />}
        </>
    );
}

export default ProfilePage;