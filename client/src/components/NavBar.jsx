import React, { useRef } from "react";
import SearchIcon from "../assets/loupe.png";
import message from "../assets/navbar-assets/message-circle.png"
import profile from "../assets/navbar-assets/user-round-pen.png"
import bell from "../assets/navbar-assets/bell.png"
import create from "../assets/navbar-assets/circle-plus.png"
import {
  useGoMessage,
  popNotifications,
  useCreatePost,
  useGoProfile,
} from "../utils/navActions"


const NavBar = () => {
    return(
        <div>
            <div className="navbar-container">
                <div className="nav-bar">
                    <div className="logo-section">Film Flex</div>
                    <div className="searchbar-section">
                        <SearchBar/>
                    </div>
                    <ActionSection/>
                </div>
            </div>
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

const ActionSection = () => {
  const goMessage = useGoMessage();
  const createPost = useCreatePost();
  const goProfile = useGoProfile();
  const showNotifications = popNotifications();

  return(
    <div className="action-section">
      <div onClick={goMessage} className="messages">
        <img src={message} alt="message" className="messages" />
      </div>
      <div onClick={popNotifications} className="notifications">
        <img src={bell} alt="notification" className="notifications" />
      </div>
      <div onClick={createPost} className="create-post">
        <img src={create} alt="Make a post" className="create-post" />
      </div>
      <div onClick={goProfile}className="profile">
        <img src={profile} alt="profile" className="profile" />
      </div>
    </div>
  )

}

export default NavBar;