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
import { AuthContext} from "../context/authContext";

/**
 * Main navigation bar component with logo, search, and action buttons
 */
const NavBar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { user, logout } = useContext(AuthContext); // get user from context

  // Lock scroll when any modal is open
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

  const handleLogout = () => {
    logout(); // Call logout 
  };

  return (
    <div>
      <div className="navbar-container">
        <div className="nav-bar">
          {/* App logo/home link */}
          <Link to="/" className="logo-section">Film Flex</Link>
          <div className="searchbar-section">
            <SearchBar />
          </div>
          {/* Navigation action buttons */}
          <ActionSection
            onShowCreateModal={() => setShowCreateModal(true)}
            onShowNotificationModal={() => setShowNotificationModal(true)}
            onLogout={handleLogout}  
            userId={user && user._id}
          />
        </div>
      </div>
      {/* Conditionally render modals */}
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

/**
 * Search bar component with clickable wrapper for better UX
 */
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

/**
 * Action buttons section for navigation (messages, notifications, create, profile)
 */
const ActionSection = ({ onShowCreateModal, onShowNotificationModal, onLogout, userId }) => {
  const goMessage = useGoMessage();
  const goProfile = useGoProfile(userId);

  return (
    <div className="action-section">
      {/* Messages navigation */}
      <div onClick={goMessage} className="messages">
        <img src={message} alt="message" className="messages" />
      </div>
      {/* Notifications modal trigger */}
      <div onClick={onShowNotificationModal} className="notifications">
        <img src={bell} alt="notification" className="notifications" />
      </div>
      {/* Create post modal trigger */}
      <div onClick={onShowCreateModal} className="create-post">
        <img src={create} alt="Make a post" className="create-post" />
      </div>
      {/* Profile navigation */}
      <div onClick={goProfile} className="profile">
        <img src={profile} alt="profile" className="profile" />
      </div>
      {/* Logout button */}
      <div onClick={onLogout} className="logout">
        <span className="logout-text">Log out</span>
      </div>
    </div>
  );
};

export default NavBar;