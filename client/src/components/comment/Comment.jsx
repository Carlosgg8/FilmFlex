import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

import './Comment.css'

// Enable relative time plugin
dayjs.extend(relativeTime);


/**
 * Renders a single comment with user profile image, username, message, and like count
 */
export default function CommentItem({comment, onLikeComment, currentUserId}){
    // Check if current user has liked this comment
    const isLiked = Array.isArray(comment.likes) 
        ? comment.likes.some(id => id.toString() === currentUserId?.toString())
        : false;
    
    const likesCount = Array.isArray(comment.likes) ? comment.likes.length : 0;

    const handleLike = () => {
        if (onLikeComment) {
            onLikeComment(comment._id);
        }
    };

    return(
        <div className="comment-container">
                <img className="profile-image hoverable" src={comment.profile_image_url}/>
                <div>
                    <div>
                        <span className="modal-username hoverable">{comment.profile_name}</span>
                        <span className="">{comment.message}</span>
                    </div>
                    <div className="comment-details ">
                        <div className="commentInteract">
                            <span className="time">
                                {dayjs(comment.createdAt).fromNow()}
                            </span>
                            {likesCount > 0 && (
                                <span>{likesCount} {likesCount > 1 ? "likes" : "like"}</span>
                            )}
                            <span className="hoverable">Reply</span>
                            <span onClick={handleLike} className="hoverable" style={{ cursor: 'pointer' }}>
                                {isLiked ? (
                                    <Favorite fontSize="small" style={{ color: 'red' }} />
                                ) : (
                                    <FavoriteBorder fontSize="small" />
                                )}
                            </span>
                        </div>
                    </div>
                </div>

        </div>
    );
}