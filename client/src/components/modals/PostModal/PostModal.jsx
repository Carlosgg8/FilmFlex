import React, { useEffect, useState, useContext } from "react";
import './Modal.css'
import { postAPI, userAPI } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

import MoreHoriz from "@mui/icons-material/MoreHoriz"
import Close from "@mui/icons-material/Close"
import CommentItem from "../../comment/Comment";
import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";
import Send from "@mui/icons-material/Send";
import BookMark from "@mui/icons-material/BookMark";
import StarRate from "@mui/icons-material/StarRate";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import Delete from "@mui/icons-material/Delete"; 

export default function PostModal({ onClose, post, onAddComment, onLikePost, onDeletePost, user}) {
    const { user: authUser } = useContext(AuthContext);

    const navigate = useNavigate();
    
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [localPost, setLocalPost] = useState(post); // Local copy that updates immediately
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    // Debug: Log user data when component renders
    console.log('PostModal user prop:', user);
    console.log('User picture:', user?.picture);

    // Sync with parent when post prop changes
    useEffect(() => {
        setLocalPost(post);
    }, [post]);
    
    // Determine if this post is from the current user and use live profile picture if so
    const isCurrentUserPost = localPost.user?.toString() === authUser?.userId?.toString();
    const postAuthorPicture = isCurrentUserPost 
        ? (authUser?.picture || localPost.user_profile_image_url) 
        : localPost.user_profile_image_url;

    // Check if current user has liked this post
    const isLiked = Array.isArray(localPost.likes) ? localPost.likes.some(id => id.toString() === user?.userId?.toString()) : false;
    const likesCount = Array.isArray(localPost.likes) ? localPost.likes.length : (typeof localPost.likes === 'number' ? localPost.likes : 0);

    // Check if post is saved on mount
    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const response = await userAPI.getSavedPosts();
                const saved = response.data.some(p => p._id === localPost._id);
                setIsSaved(saved);
            } catch (error) {
                console.error('Error checking saved status:', error);
            }
        };
        if (authUser?.userId) {
            checkIfSaved();
        }
    }, [localPost._id, authUser?.userId]);

    // Check if current user is following the post author
    useEffect(() => {
        const checkFollowStatus = async () => {
            try {
                // Don't check if viewing own post
                if (localPost.user?.toString() === authUser?.userId?.toString()) {
                    return;
                }
                const response = await userAPI.getUserById(localPost.user);
                const isFollowingUser = response.data.followers?.includes(authUser?.userId);
                setIsFollowing(isFollowingUser);
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };
        if (authUser?.userId && localPost.user) {
            checkFollowStatus();
        }
    }, [localPost.user, authUser?.userId, post]);

    // Handle bookmarking/unbookmarking a post
    const handleBookmark = async () => {
        try {
            // Optimistic update
            setIsSaved(!isSaved);
            
            // API call
            await userAPI.toggleSavePost(localPost._id);
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            // Revert on error
            setIsSaved(!isSaved);
        }
    };

    // Handle liking/unliking a post
    const handleLike = async () => {
        // Optimistic update - update UI immediately
        const updatedLikes = isLiked 
            ? localPost.likes.filter(id => id.toString() !== user?.userId?.toString())
            : [...localPost.likes, user?.userId];
        
        setLocalPost({ ...localPost, likes: updatedLikes });

        // Then call API
        if (onLikePost) {
            await onLikePost(localPost._id);
        }
    };

    // Handle deleting a post
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }
        
        try {
            await postAPI.deletePost(post._id);
            if (onDeletePost) {
                onDeletePost(post._id);
            }
            onClose();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const handleProfileClick = () => {
        const profileUserId = localPost.user;
        navigate(`/profile/${profileUserId}`);
        onClose(); // Close the modal before navigating
    };

    // Handle follow/unfollow
    const handleFollowClick = async () => {
        try {
            // Optimistic update
            setIsFollowing(!isFollowing);

            // API call
            await userAPI.followUser(localPost.user);
        } catch (err) {
            console.error('Error toggling follow:', err);
            // Revert on error
            setIsFollowing(!isFollowing);
        }
    };

    // Handle liking a comment
    const handleLikeComment = async (commentId) => {
        try {
            
            const updatedComments = localPost.comments.map(c => {
                if (c._id === commentId) {
                    const isLiked = Array.isArray(c.likes) && c.likes.some(id => id.toString() === user?.userId?.toString());
                    const newLikes = isLiked
                        ? c.likes.filter(id => id.toString() !== user?.userId?.toString())
                        : [...(c.likes || []), user?.userId];
                    return { ...c, likes: newLikes };
                }
                return c;
            });
            
            setLocalPost({ ...localPost, comments: updatedComments });
            
            // API call
            await postAPI.likeComment(localPost._id, commentId);
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    // Create slides array based on available content
    const slides = [
        localPost?.poster && { type: 'poster', content: localPost.poster, title: 'Movie Poster' },
        localPost?.reactionIMG && { type: 'reaction', content: localPost.reactionIMG, title: 'Reaction' },
        localPost?.rating && { type: 'rating', content: localPost.rating, title: 'Rating' },
        // Fallback to original imageURL if none of the above exist
        !localPost?.poster && !localPost?.reactionIMG && localPost?.imageURL && { type: 'image', content: localPost.imageURL, title: 'Image' }
    ].filter(Boolean);

    // Helper to get scrollbar width
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    useEffect(() => {
        // On mount: lock scroll and add padding
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = scrollbarWidth + "px";
        return () => {
            // On unmount: restore scroll and remove padding
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, []);

    // Handle clicking outside modal to close
    function onClickModal(element) {
        if (element.classList.contains("postModal-container")) {
            onClose();
        }
    }

    // Navigate to next slide in carousel
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    // Navigate to previous slide in carousel
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Handle adding a new comment
    const handleAddComment = (e) => {
        e.preventDefault();
        
        // Don't add empty comments
        if (!newComment.trim()) return;

        // Create new comment object matching backend structure with populated user data
        const comment = {
            message: newComment.trim(),
            user: {
                _id: user?.userId,
                username: user?.username || user?.name || "Anonymous",
                picture: user?.picture || "https://via.placeholder.com/150"
            },
            likes: []
        };

        // Call parent function to update the post
        const postId = localPost._id || localPost.id;
        if (onAddComment && postId) {
            onAddComment(postId, comment);
        }

        // Clear the input
        setNewComment("");
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddComment(e);
        }
    };

    // Render content based on slide type
    const renderSlideContent = (slide) => {
        if (!slide) return null;
        
        switch (slide.type) {
            case 'poster':
            case 'reaction':
            case 'image':
                return (
                    <div className="slide-image-container">
                        <img 
                            className="modal-image" 
                            src={slide.content} 
                            alt={slide.title}
                        />
                        <div className="slide-title">{slide.title}</div>
                    </div>
                );
            case 'rating':
                return (
                    <div className="slide-rating-container">
                        <div className="rating-display">
                            <h3>Rating</h3>
                            <div className="stars-display">
                                {/* Display star rating visually */}
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarRate
                                        key={star}
                                        fontSize="large"
                                        className={`star ${star <= slide.content ? 'rated' : 'unrated'}`}
                                    />
                                ))}
                            </div>
                            <div className="rating-text">
                                {slide.content}/5 stars
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div onClick={(e) => onClickModal(e.target)} className="postModal-container">
            {/* Close button */}
            <div onClick={() => onClose()} className="close-modal hoverable">
                <Close fontSize="large"/>
            </div>
            
            <div className="modal">
                {/* Image Carousel Section */}
                <div className="modal-carousel-container">
                    {/* Previous slide arrow */}
                    {slides.length > 1 && (
                        <button 
                            className="carousel-arrow carousel-arrow-left hoverable"
                            onClick={prevSlide}
                        >
                            <ArrowBackIos />
                        </button>
                    )}
                    {/* Current slide content */}
                    <div className="carousel-content">
                        {slides.length > 0 ? renderSlideContent(slides[currentSlide]) : (
                            <div className="slide-image-container">
                                <img className="modal-image" src={post?.imageURL} alt="Post image"/>
                            </div>
                        )}
                    </div>
                    {/* Next slide arrow */}
                    {slides.length > 1 && (
                        <button 
                            className="carousel-arrow carousel-arrow-right hoverable"
                            onClick={nextSlide}
                        >
                            <ArrowForwardIos />
                        </button>
                    )}
                    
                    {/* Slide indicators */}
                    {slides.length > 1 && (
                        <div className="carousel-indicators">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Content Section */}
                <div className="modal-content-section">
                    {/* User info header */}
                    <div className="modal-top-section modal-section">
                        <img 
                            className="profile-image hoverable" 
                            src={postAuthorPicture}
                            onClick={handleProfileClick}
                            style={{ cursor: 'pointer' }}
                        />
                        <div 
                            className="modal-username" 
                            onClick={handleProfileClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {localPost.username}
                        </div>
                        {user?.userId !== localPost.user && (
                            <div 
                                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                onClick={handleFollowClick}
                                style={{ cursor: 'pointer' }}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </div>
                        )}
                        <div className="spacer"></div>
                        {user?.userId === localPost.user && (
                            <Delete className="hoverable" onClick={handleDelete} style={{ cursor: 'pointer' }} />
                        )}
                        <MoreHoriz/>
                    </div>
                    {/* Comments section with original post caption */}
                    <div className="modal-comment-section modal-section">
                        <div className="comment-container">
                            <img 
                                className="profile-image hoverable" 
                                src={postAuthorPicture}
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
                                        {localPost.username}
                                    </span>
                                    <span className="post-caption">{localPost.caption}</span>
                                </div>
                            </div>
                        </div>
                        {/* Render existing comments */}
                        {localPost.comments?.map((comment, index) => (
                            <CommentItem 
                                key={index} 
                                comment={comment}
                                onLikeComment={handleLikeComment}
                                currentUserId={user?.userId}
                            />
                        ))}
                    </div>
                    {/* Like and action buttons */}
                    <div className="modal-detail-section modal-section">
                        <div className="detail-actions">
                            <Favorite 
                                className={`hoverable ${isLiked ? 'liked' : ''}`}
                                onClick={handleLike}
                                style={{ color: isLiked ? '#e91e63' : 'inherit', cursor: 'pointer' }}
                            />
                            <ModeComment className="hoverable"/>
                            <Send className="hoverable"/>
                            <div className="spacer"></div>
                            <BookMark 
                                className="hoverable"
                                onClick={handleBookmark}
                                style={{ 
                                    color: isSaved ? '#FFD700' : '#000',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                        <span>{likesCount} Likes</span>
                    </div>
                    
                    <div className="modal-write-section">
                        <form onSubmit={handleAddComment}>
                            <input 
                                type="text" 
                                placeholder="Add a comment..."
                                className="comment-input"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button 
                                type="submit" 
                                style={{ display: 'none' }} // Hidden
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}