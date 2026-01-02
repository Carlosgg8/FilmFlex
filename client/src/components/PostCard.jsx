import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import threeDots from "../assets/3dots.png";
import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";
import Send from "@mui/icons-material/Send";
import BookMark from "@mui/icons-material/BookMark";
import StarRate from "@mui/icons-material/StarRate";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { AuthContext } from "../context/authContext";
import { userAPI, postAPI } from "../services/api";

/**
 * Main post card component for feed display with carousel functionality
 */
function PostCard({post, onCommentClick, onLikePost, onDeletePost}) {
  const { user } = useContext(AuthContext);
  
  // Use current user's live picture if this is their post
  const isCurrentUserPost = post.user?.toString() === user?.userId?.toString();
  const postAuthorPicture = isCurrentUserPost 
    ? (user?.picture || post.user_profile_image_url || post.profileImage)
    : (post.user_profile_image_url || post.profileImage);
  
  return (
    <div className="post-card">
      <Header profileImage={postAuthorPicture} username={post.username} userId={post.user} postId={post._id || post.id} onDeletePost={onDeletePost} />
      <PhotoCarousel post={post} />
      <Caption text={post.caption} />
      <ActionBar onCommentClick={() => onCommentClick(post)} onLikePost={() => onLikePost(post._id || post.id)} post={post} />
    </div>
  );
}

/**
 * Header component showing user profile info and menu options
 */
const Header = ({ profileImage, username, userId, postId, onDeletePost }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  
  // Check if this is the current user's post
  useEffect(() => {
    if (user?.userId && userId) {
      setIsOwnPost(user.userId.toString() === userId.toString());
    }
  }, [user?.userId, userId]);

  // Check if current user is following this user
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        if (isOwnPost) return;
        
        const response = await userAPI.getUserById(userId);
        const isFollowingUser = response.data.followers?.includes(user?.userId);
        setIsFollowing(isFollowingUser);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };
    
    if (user?.userId && userId && !isOwnPost) {
      checkFollowStatus();
    }
  }, [userId, user?.userId, isOwnPost]);
  
  const handleProfileClick = () => {
    navigate(`/profile/${userId}`);
  };

  const handleFollowClick = async (e) => {
    e.stopPropagation(); // Prevent triggering profile navigation
    try {
      // Optimistic update
      setIsFollowing(!isFollowing);

      // API call
      await userAPI.followUser(userId);
    } catch (err) {
      console.error('Error toggling follow:', err);
      // Revert on error
      setIsFollowing(!isFollowing);
    }
    setShowOptionsMenu(false);
  };

  const handleCopyLink = () => {
    const postLink = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postLink);
    alert('Link copied to clipboard!');
    setShowOptionsMenu(false);
  };

  const handleReport = () => {
    alert('Report functionality coming soon!');
    setShowOptionsMenu(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      setShowOptionsMenu(false);
      return;
    }
    try {
      await postAPI.deletePost(postId);
      if (onDeletePost) {
        onDeletePost(postId);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
    setShowOptionsMenu(false);
  };
  
  return(
    <div className="bar">
      {/* User profile section */}
      <div className="bar-left">
        <img 
          src={profileImage} 
          alt={`${username}'s profile`} 
          className="profile-image" 
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        />
        <div 
          className="profile-name"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        >
          {username}
        </div>
        {!isOwnPost && (
          <button 
            className={`follow-btn-card ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowClick}
            style={{ 
              marginLeft: '10px',
              padding: '5px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: isFollowing ? '#dbdbdb' : '#0095f6',
              color: isFollowing ? '#000' : '#fff'
            }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
      {/* Menu options */}
      <div className="bar-right" style={{ position: 'relative' }}>
        <img 
          src={threeDots} 
          alt="menu" 
          className="menu-icon" 
          onClick={() => setShowOptionsMenu(!showOptionsMenu)}
          style={{ cursor: 'pointer' }}
        />
        {showOptionsMenu && (
          <div className="options-menu-card">
            {isOwnPost ? (
              <>
                <div className="menu-item-card" onClick={handleDelete}>
                  Delete Post
                </div>
                <div className="menu-item-card" onClick={handleCopyLink}>
                  Copy Link
                </div>
              </>
            ) : (
              <>
                <div className="menu-item-card" onClick={handleReport}>
                  Report
                </div>
                {isFollowing && (
                  <div className="menu-item-card" onClick={handleFollowClick}>
                    Unfollow @{username}
                  </div>
                )}
                <div className="menu-item-card" onClick={handleCopyLink}>
                  Copy Link
                </div>
              </>
            )}
            <div className="menu-item-card" onClick={() => setShowOptionsMenu(false)}>
              Cancel
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Carousel component for displaying multiple content types (poster, reaction, rating)
 */
const PhotoCarousel = ({ post }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Create slides array based on available content
  const slides = [
    post?.poster && { type: 'poster', content: post.poster, title: 'Movie Poster' },
    post?.reactionIMG && { type: 'reaction', content: post.reactionIMG, title: 'Reaction' },
    post?.rating && { type: 'rating', content: post.rating, title: 'Rating' },
    // Fallback to original photoSrc or imageURL if none of the above exist
    !post?.poster && !post?.reactionIMG && (post?.photoSrc || post?.imageURL) && { 
      type: 'image', 
      content: post.photoSrc || post.imageURL, 
      title: 'Photo' 
    }
  ].filter(Boolean);

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Navigate to prev slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Render different content types based on slide type
  const renderSlideContent = (slide) => {
    if (!slide) return null;
    
    switch (slide.type) {
      case 'poster':
      case 'reaction':
      case 'image':
        return (
          <div className="card-slide-image-container">
            <img 
              className="photo" 
              src={slide.content} 
              alt={slide.title}
            />
          </div>
        );
      case 'rating':
        return (
          <div className="card-slide-rating-container">
            <div className="card-rating-display">
              <h3>Rating</h3>
              <div className="card-stars-display">
                {/* Visual star rating display */}
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarRate
                    key={star}
                    fontSize="large"
                    className={`star ${star <= slide.content ? 'rated' : 'unrated'}`}
                  />
                ))}
              </div>
              <div className="card-rating-text">
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
    <div className="photo-container">
      <div className="card-carousel-container">
        {/* Previous arrow */}
        {slides.length > 1 && (
          <button 
            className="card-carousel-arrow card-carousel-arrow-left"
            onClick={prevSlide}
          >
            <ArrowBackIos fontSize="small" />
          </button>
        )}
        {/* Current slide content */}
        <div className="card-carousel-content">
          {slides.length > 0 ? renderSlideContent(slides[currentSlide]) : (
            <div className="card-slide-image-container">
              <img className="photo" src={post?.photoSrc || post?.imageURL} alt="Post"/>
            </div>
          )}
        </div>
        {/* Next arrow */}
        {slides.length > 1 && (
          <button 
            className="card-carousel-arrow card-carousel-arrow-right"
            onClick={nextSlide}
          >
            <ArrowForwardIos fontSize="small" />
          </button>
        )}
        
        {/* Slide indicators */}
        {slides.length > 1 && (
          <div className="card-carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`card-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
/**
 * Action bar with like, comment, share, and bookmark buttons
 */
const ActionBar = ( {onCommentClick, onLikePost, post} ) => {
  const { user } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(false);
  
  // Check if current user has liked this post
  const isLiked = Array.isArray(post.likes) ? post.likes.some(id => id.toString() === user?.userId?.toString()) : false;
  
  // Check if post is saved on mount
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await userAPI.getSavedPosts();
        const saved = response.data.some(p => p._id === post._id);
        setIsSaved(saved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    if (user?.userId && post._id) {
      checkIfSaved();
    }
  }, [post._id, user?.userId]);
  
  const handleLike = () => {
    if (onLikePost) {
      onLikePost();
    }
  };

  const handleBookmark = async () => {
    try {
      // Optimistic update
      setIsSaved(!isSaved);
      
      // API call
      await userAPI.toggleSavePost(post._id);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert on error
      setIsSaved(!isSaved);
    }
  };

  return(
    <div className="bar">
      {/* Left side actions */}
      <div className="bar-left">
        <Favorite 
          alt="heart" 
          className={`action-icon ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        />
        <ModeComment alt="comment" className="action-icon" onClick={onCommentClick}/>
        <Send alt="send" className="action-icon"/>
      </div>
      {/* Right side actions */}
      <div className="bar-right">
        <BookMark 
          alt="bookmark" 
          className={`action-icon-right ${isSaved ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
        />
      </div>
    </div>
  )
}
/**
 * Caption component for displaying post text
 */
const Caption = ({ text }) => <p className="caption">{text}</p>;

export default PostCard;