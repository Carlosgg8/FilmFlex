import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "../assets/loupe.png";
import message from "../assets/navbar-assets/message-circle.png"
import profile from "../assets/navbar-assets/user-round-pen.png"
import bell from "../assets/navbar-assets/bell.png"
import create from "../assets/navbar-assets/circle-plus.png"
import CreatModal from "./modals/CreateModal/CreateModal";
import {
  useGoMessage,
  popNotifications,
  useCreatePost,
  useGoProfile,
} from "../utils/navActions"


const NavBar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
  if (showCreateModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showCreateModal]);

    return(
        <div>
            <div className="navbar-container">
                <div className="nav-bar">
                    <Link to="/" className="logo-section">Film Flex</Link>
                    <div className="searchbar-section">
                        <SearchBar/>
                    </div>
                    <ActionSection onShowCreateModal={() => setShowCreateModal(true)} />
                </div>
            </div>
            {showCreateModal && <CreatModal onClose={() => setShowCreateModal(false)} />}
        </div>
    )
}

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

const ActionSection = ({ onShowCreateModal }) => {
  const goMessage = useGoMessage();
  const goProfile = useGoProfile();
  const showNotifications = popNotifications();

  return(
    <div className="action-section">
      <div onClick={goMessage} className="messages">
        <img src={message} alt="message" className="messages" />
      </div>
      <div onClick={showNotifications} className="notifications">
        <img src={bell} alt="notification" className="notifications" />
      </div>
      {/* Updated to use onShowCreateModal instead of createPost */}
      <div onClick={onShowCreateModal} className="create-post">
        <img src={create} alt="Make a post" className="create-post" />
      </div>
      <div onClick={goProfile} className="profile">
        <img src={profile} alt="profile" className="profile" />
      </div>
    </div>
  )

}

export default NavBar;