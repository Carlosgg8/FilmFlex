import React, { useState, useEffect } from "react";
import './CreateModal.css';
import Close from "@mui/icons-material/Close";
import StarRate from "@mui/icons-material/StarRate";

/**
 * Modal component for creating movie reviews with poster, reaction image, rating, and caption
 */

export default function CreateModal({ onClose }) {
    const [formData, setFormData] = useState({
        poster: null,
        reactionIMG: null,
        rating: 0,
        caption: ''
    });

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

    // Handle image upload for both poster and reaction images
    const handleImageUpload = (type) => (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Convert uploaded file to base64 data URL for preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, [type]: event.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handlePost = async () => {
    try {
        // Validate user authentication
        const token = localStorage.getItem("jwt");
        
        if (!token) {
            console.error("No token found - user needs to log in");
            return;
        }
        
        // Verify JWT token format
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error("Invalid JWT format - clearing token");
            localStorage.removeItem("jwt");
            return;
        }
        
        // Debug logging for development
        console.log("Form data being sent:", formData);
        console.log("reactionIMG value:", formData.reactionIMG);
        console.log("reactionIMG is null?", formData.reactionIMG === null);
        console.log("Token being sent:", token.substring(0, 20) + "...");
        
        // Submit review data to backend
        const response = await fetch("http://localhost:5000/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        
        // Authentication errors
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("jwt");
            console.error("Token expired or invalid - user needs to log in again");
            return;
        }
        
        // Other errors
        if (!response.ok) {
            const errorText = await response.text();
            console.log("Server error response:", errorText);
            throw new Error(`Failed to create post: ${response.status} ${response.statusText}`);
        }

        // Success
        const createdPost = await response.json();
        console.log("Created post:", createdPost);
        onClose();
        
    } catch (error) {
        console.error("Error posting review:", error);
    }
};

    return (
        /* Modal backdrop - clicking outside closes modal */
        <div onClick={(e) => {
                if (e.target.className === "createModal-container") {
                    onClose();
                }
            }} className="createModal-container">
            <div onClick={() => onClose()} className="close-modal hoverable">
                <Close fontSize="large"/>
            </div>
            
            <div className="modal create-modal">
                {/* Left Column - Images */}
                <div className="modal-image-container">
                    <div className="image-upload-section">
                        <input 
                            type="file" 
                            id="poster-upload" 
                            onChange={handleImageUpload('poster')}
                            accept="image/*"
                            hidden
                        />
                        <label htmlFor="poster-upload" className="upload-label">
                            {formData.poster ? (
                                <img src={formData.poster} className="modal-image" alt="Poster preview"/>
                            ) : (
                                <div className="upload-placeholder">
                                    <p>Click to upload movie poster</p>
                                </div>
                            )}
                        </label>
                    </div>
                    
                    <div className="image-upload-section">
                        <input 
                            type="file" 
                            id="reaction-upload" 
                            onChange={handleImageUpload('reactionIMG')}
                            accept="image/*"
                            hidden
                        />
                        <label htmlFor="reaction-upload" className="upload-label">
                            {formData.reactionIMG ? (  
                                <img src={formData.reactionIMG} className="modal-image" alt="Reaction preview"/>
                            ) : (
                                <div className="upload-placeholder">
                                    <p>Click to upload your reaction</p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>
                
                {/* Right Column - Content */}
                <div className="modal-content-section">
                    <div className="modal-top-section modal-section">
                        <h2>Create Review</h2>
                    </div>
                    
                    <div className="modal-comment-section modal-section">
                        <div className="rating-section">
                            <h3>Your Rating</h3>
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarRate
                                        key={star}
                                        fontSize="large"
                                        className={`star ${star <= formData.rating ? 'rated' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <textarea
                            placeholder="Write your review..."
                            value={formData.caption}
                            onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                            className="caption-input"
                        />
                    </div>
                    
                    <div className="modal-detail-section modal-section">
                        <button 
                            onClick={handlePost}
                            disabled={!formData.poster || !formData.reactionIMG || !formData.caption}  
                            className="post-button"
                        >
                            Post Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}