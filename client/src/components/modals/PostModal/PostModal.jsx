import React, { useEffect, useState } from "react";
import './Modal.css'

import MoreHoriz from "@mui/icons-material/MoreHoriz"
import Close from "@mui/icons-material/Close"
import CommentItem from "../../comment/comment";
import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";
import Send from "@mui/icons-material/Send";
import BookMark from "@mui/icons-material/BookMark";
import StarRate from "@mui/icons-material/StarRate";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos"; 

export default function PostModal({ onClose, post}) {

    const [currentSlide, setCurrentSlide] = useState(0);

    // Create slides array based on available content
    const slides = [
        post?.poster && { type: 'poster', content: post.poster, title: 'Movie Poster' },
        post?.reactionIMG && { type: 'reaction', content: post.reactionIMG, title: 'Reaction' },
        post?.rating && { type: 'rating', content: post.rating, title: 'Rating' },
        // Fallback to original imageURL if none of the above exist
        !post?.poster && !post?.reactionIMG && post?.imageURL && { type: 'image', content: post.imageURL, title: 'Image' }
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
                        <img className="profile-image hoverable" src={post.user_profile_image_url}/>
                        <div className="modal-username">{post.user}</div>
                        <div>Follow</div>
                        <div className="spacer"></div>
                        <MoreHoriz/>
                    </div>
                    {/* Comments section with original post caption */}
                    <div className="modal-comment-section modal-section">
                        <div className="comment-container">
                            <img className="profile-image hoverable" src={post.user_profile_image_url}/>
                            <div>
                                <div>
                                    <span className="modal-username hoverable">{post.user}</span>
                                    <span className="post-caption">{post.caption}</span>
                                </div>
                            </div>
                        </div>
                        {/* Render existing comments */}
                        {post.comments?.map((comment, index) => (
                            <CommentItem key={index} comment={comment} />
                        ))}
                    </div>
                    {/* Like and action buttons */}
                    <div className="modal-detail-section modal-section">
                        <div className="detail-actions">
                            <Favorite className="hoverable"/>
                            <ModeComment className="hoverable"/>
                            <Send className="hoverable"/>
                            <div className="spacer"></div>
                            <BookMark className="hoverable"/>
                        </div>
                        <span>{post.likes} Likes</span>
                    </div>
                    
                    <div className="modal-write-section">
                        <input 
                            type="text" 
                            placeholder="Add a comment..."
                            className="comment-input"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}