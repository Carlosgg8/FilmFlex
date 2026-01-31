import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { AuthContext } from "../../context/authContext";

import './Comment.css'

// Enable relative time plugin
dayjs.extend(relativeTime);


/**
 * Renders a single comment with user profile image, username, message, and like count
 */
export default function CommentItem({comment, onLikeComment, currentUserId}){
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const isLiked = Array.isArray(comment.likes) 
        ? comment.likes.some(id => id.toString() === currentUserId?.toString())
        : false;
    
    const likesCount = Array.isArray(comment.likes) ? comment.likes.length : 0;

    // Get the comment author's ID (handle both ObjectId objects and strings)
    const commentUserId = comment.user?._id || comment.user;
    
    // Check if this comment is from the current logged-in user
    const isCurrentUser = commentUserId?.toString() === user?.userId?.toString();
    
    // Use current user's live picture if this is their comment, otherwise use populated/cached data
    const profileImage = isCurrentUser 
        ? (user?.picture || 'https://via.placeholder.com/150')
        : (comment.user?.picture || comment.profile_image_url || 'https://via.placeholder.com/150');
    
    const profileName = comment.user?.username || comment.profile_name || 'Anonymous';

    // Handle profile navigation
    const handleProfileClick = () => {
        navigate(`/profile/${commentUserId}`);
    };

    return(
        <div className="comment-container">
                <img 
                    className="profile-image hoverable" 
                    src={profileImage}
                    onClick={handleProfileClick}
                    style={{ cursor: 'pointer' }}
                />
                <div>
                    <div>
                        <span 
                            className="modal-username hoverable"
                            onClick={handleProfileClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {profileName}
                        </span>
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
                            <span onClick={() => onLikeComment?.(comment._id)} className="hoverable" style={{ cursor: 'pointer' }}>
                                {isLiked ? (
                                    <Favorite fontSize="small" style={{ color: '#e91e63' }} />
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