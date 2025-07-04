import React from "react";
import threeDots from "../assets/3dots.png";
import heart from "../assets/heart.png";
import comment from "../assets/chat.png";
import send from "../assets/send.png"
import bookmark from "../assets/bookmark.png"

function PostCard({post}) {
  return (
    <div className="post-card">
      <Header profileImage={post.profileImage} user={post.user} />
      <div className="photo-container">
        <Photo src={post.photoSrc} />
      </div>
      <Caption text={post.caption} />
      <ActionBar />
    </div>
  );
}

const Header = ({ profileImage, user }) => {
  return(
    <div className="bar">
    <div className="bar-left">
      <img src={profileImage} alt={`${user}'s profile`} className="profile-image" />
      <div className="profile-name">{user}</div>
    </div>
    <div className="bar-right">
      <img src={threeDots} alt="menu" className="menu-icon" />
    </div>
  </div>
  );
}

const Photo = ({src}) => {
  return(
    <div className="photo-wrapper">
      <img className="photo" src={src}/>
    </div>
  )
}

const ActionBar = () => {
  return(
    <div className="bar">
      <div className="bar-left">
        <img src={heart} alt="heart" className="action-icon"/>
        <img src={comment} alt="comment" className="action-icon"/>
        <img src={send} alt="send" className="action-icon"/>
        
      </div>
      <div className="bar-right">
        <img src={bookmark} alt="bookmark" className="action-icon-right"/>
      </div>
    </div>
  )
}

const Caption = ({ text }) => <p className="caption">{text}</p>;

export default PostCard;