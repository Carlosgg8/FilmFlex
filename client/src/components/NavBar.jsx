import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "../assets/loupe.png";
import message from "../assets/navbar-assets/message-circle.png"
import profile from "../assets/navbar-assets/user-round-pen.png"
import bell from "../assets/navbar-assets/bell.png"
import create from "../assets/navbar-assets/circle-plus.png"
import CreatModal from "./modals/CreateModal/CreateModal";
import NotificationModal from "./modals/NotificationModal/NotificationModal";
import {
  useGoMessage,
  useCreatePost,
  useGoProfile,
} from "../utils/navActions"
import { AuthContext } from "../context/authContext";

const NavBar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { user } = useContext(AuthContext); // get user from context

  useEffect(() => {
    if (showCreateModal || showNotificationModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCreateModal, showNotificationModal]);

  return (
    <div>
      <div className="navbar-container">
        <div className="nav-bar">
          <Link to="/" className="logo-section">Film Flex</Link>
          <div className="searchbar-section">
            <SearchBar />
          </div>
          <ActionSection
            onShowCreateModal={() => setShowCreateModal(true)}
            onShowNotificationModal={() => setShowNotificationModal(true)}
            userId={user && user._id}
          />
        </div>
      </div>
      {showCreateModal && (
        <CreatModal 
          onClose={() => setShowCreateModal(false)}
          
        />
      )}
      {showNotificationModal && (
        <NotificationModal onClose={() => setShowNotificationModal(false)} />
      )}
    </div>
  );
};

const SearchBar = () => {
  const inputRef = useRef(null); 
  return (
    <div
      className="search-wrapper"
      onClick={() => inputRef.current && inputRef.current.focus()} 
    >
      <img src={SearchIcon} alt="search" className="search-icon" />
      <input
        type="text"
        placeholder="Search"
        className="search-input"
        ref={inputRef}
      />
    </div>
  );
};

const ActionSection = ({ onShowCreateModal, onShowNotificationModal, userId }) => {
  const goMessage = useGoMessage();
  const goProfile = useGoProfile(userId);

  return (
    <div className="action-section">
      <div onClick={goMessage} className="messages">
        <img src={message} alt="message" className="messages" />
      </div>
      <div onClick={onShowNotificationModal} className="notifications">
        <img src={bell} alt="notification" className="notifications" />
      </div>
      <div onClick={onShowCreateModal} className="create-post">
        <img src={create} alt="Make a post" className="create-post" />
      </div>
      <div onClick={goProfile} className="profile">
        <img src={profile} alt="profile" className="profile" />
      </div>
    </div>
  );
};

export default NavBar;