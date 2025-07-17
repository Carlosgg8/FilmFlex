import React from "react";
import './Modal.css'

import MoreHoriz from "@mui/icons-material/MoreHoriz"
import Close from "@mui/icons-material/Close"
import CommentItem from "../comment/comment";
import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";
import Send from "@mui/icons-material/Send";
import BookMark from "@mui/icons-material/BookMark";

export default function PostModal({ onClose, post}) {
    function onClickModal(element) {
        if (element.className === "postModal-container") {
        onClose();
        }
    }

    return( 
        <div onClick={(e) => onClickModal(e.target)} className="postModal-container">
            <div onClick={() => onClose() }className="close-modal hoverable">
                <Close fontSize="large"/>
            </div>
            <div className="modal">
                <img className="modal-image"  src={post.imageURL}/>
                <div className="modal-content-section">
                    <div className="modal-top-section modal-section">
                        <img className="profile-image hoverable" src={post.user_profile_image_url}/>
                        <div className="modal-username">{post.user}</div>
                        <div>Follow</div>
                        <div className="spacer"></div>
                       <MoreHoriz/>
                    </div>
                    <div className="modal-comment-section modal-section">
                        <div className="comment-container">
                            <img className="profile-image hoverable" src={post.user_profile_image_url}/>
                            <div>
                                <div>
                                    <span className="modal-username hoverable">{post.user}</span>
                                    <span className="">{post.caption}</span>
                                </div>
                            </div>
                        </div>
                        {post.comments.map((comment, index) => 
                            (<CommentItem key={index} comment={comment}/>
                        ))}
                    </div>
                    <div className="modal-detail-section modal-section">
                        <div className="detail-actions ">
                            <Favorite className="hoverable"/>
                            <ModeComment className="hoverable"/>
                            <Send className="hoverable"/>
                            <div className="spacer"></div>
                            <BookMark className="hoverable"/>
                        </div>
                        <span>{post.likes} Likes</span>
                    </div>
                    <div className="modal-write-section"> Write Here</div>
                </div>
            </div>
        </div>
    );

}