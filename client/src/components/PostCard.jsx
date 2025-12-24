import React, { useState, useContext } from "react";
import threeDots from "../assets/3dots.png";
import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";
import Send from "@mui/icons-material/Send";
import BookMark from "@mui/icons-material/BookMark";
import StarRate from "@mui/icons-material/StarRate";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { AuthContext } from "../context/authContext";

/**
 * Main post card component for feed display with carousel functionality
 */
function PostCard({post, onCommentClick, onLikePost}) {
  return (
    <div className="post-card">
      <Header profileImage={post.user_profile_image_url || post.profileImage} username={post.username} />
      <PhotoCarousel post={post} />
      <Caption text={post.caption} />
      <ActionBar onCommentClick={() => onCommentClick(post)} onLikePost={() => onLikePost(post._id || post.id)} post={post} />
    </div>
  );
}

/**
 * Header component showing user profile info and menu options
 */
const Header = ({ profileImage, username }) => {
  return(
    <div className="bar">
      {/* User profile section */}
      <div className="bar-left">
        <img src={profileImage} alt={`${username}'s profile`} className="profile-image" />
        <div className="profile-name">{username}</div>
      </div>
      {/* Menu options */}
      <div className="bar-right">
        <img src={threeDots} alt="menu" className="menu-icon" />
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
  
  // Check if current user has liked this post
  const isLiked = Array.isArray(post.likes) ? post.likes.some(id => id.toString() === user?.userId?.toString()) : false;
  
  const handleLike = () => {
    if (onLikePost) {
      onLikePost();
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
          style={{ color: isLiked ? '#e91e63' : 'inherit' }}
        />
        <ModeComment alt="comment" className="action-icon" onClick={onCommentClick}/>
        <Send alt="send" className="action-icon"/>
      </div>
      {/* Right side actions */}
      <div className="bar-right">
        <BookMark alt="bookmark" className="action-icon-right"/>
      </div>
    </div>
  )
}
/**
 * Caption component for displaying post text
 */
const Caption = ({ text }) => <p className="caption">{text}</p>;

export default PostCard;