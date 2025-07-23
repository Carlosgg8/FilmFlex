import React from "react";
import threeDots from "../assets/3dots.png";
import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";
import Send from "@mui/icons-material/Send";
import BookMark from "@mui/icons-material/BookMark";

function PostCard({post, onCommentClick}) {
  return (
    <div className="post-card">
      <Header profileImage={post.profileImage} user={post.user} />
      <div className="photo-container">
        <Photo src={post.photoSrc} />
      </div>
      <Caption text={post.caption} />
      <ActionBar onCommentClick={() => onCommentClick(post)}/>
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

const ActionBar = ( {onCommentClick} ) => {
  return(
    <div className="bar">
      <div className="bar-left">
        <Favorite alt="heart" className="action-icon"/>
        <ModeComment alt="comment" className="action-icon" onClick={onCommentClick}/>
        <Send alt="send" className="action-icon"/>
        
      </div>
      <div className="bar-right">
        <BookMark alt="bookmark" className="action-icon-right"/>
      </div>
    </div>
  )
}

const Caption = ({ text }) => <p className="caption">{text}</p>;

export default PostCard;