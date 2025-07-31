import React, { useState, useEffect } from "react";
import './CreateModal.css';
import Close from "@mui/icons-material/Close";
import StarRate from "@mui/icons-material/StarRate";

export default function CreateModal({ onClose }) {
    const [formData, setFormData] = useState({
        poster: null,
        reactionImg: null,
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

    const handleImageUpload = (type) => (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, [type]: event.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handlePost = async () => {
        try {
            const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(formData)
            });

            if (!response.ok) {
            throw new Error("Failed to create post");
            }

            const createdPost = await response.json();
            console.log("Created post:", createdPost);
            onClose(); // close modal
        } catch (error) {
            console.error("Error posting review:", error);
        }
        };

    const onClickModal = (element) => {
        if (element.className === "createModal-container") {
            onClose();
        }
    };

    return (
        <div onClick={(e) => onClickModal(e.target)} className="createModal-container">
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
                            onChange={handleImageUpload('reactionImg')}
                            accept="image/*"
                            hidden
                        />
                        <label htmlFor="reaction-upload" className="upload-label">
                            {formData.reactionImg ? (
                                <img src={formData.reactionImg} className="modal-image" alt="Reaction preview"/>
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
                            disabled={!formData.poster || !formData.reactionImg || !formData.caption}
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