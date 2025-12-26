import React, { useState, useEffect, useContext } from "react";
import Close from "@mui/icons-material/Close";
import { userAPI } from "../../../services/api";
import { AuthContext } from "../../../context/authContext";
import "./editProfileModal.css";

/**
 * Modal component for editing user profile information
 */
export default function EditProfileModal({ onClose, currentUser, onProfileUpdate }) {
    const { updateUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        bio: currentUser?.bio || '',
        location: currentUser?.location || '',
        website: currentUser?.website || '',
        picture: currentUser?.picture || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Lock scroll when modal opens
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Compress image for profile picture
    const compressImage = (file, maxWidth = 400, quality = 0.8) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedDataUrl);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    // Handle profile picture upload
    const handlePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const compressedImage = await compressImage(file);
        setFormData(prev => ({ ...prev, picture: compressedImage }));
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.name.trim()) {
                setError('Name is required');
                setLoading(false);
                return;
            }

            // Call API to update profile
            const response = await userAPI.updateProfile(formData);
            console.log('Profile update response:', response.data);
            
            // Update AuthContext with new user data
            updateUser(response.data);
            console.log('Updated AuthContext user');
            
            // Notify parent component of successful update
            if (onProfileUpdate) {
                onProfileUpdate(response.data);
            }

            onClose();
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="edit-profile-modal-container"
            onClick={(e) => {
                if (e.target.className === "edit-profile-modal-container") {
                    onClose();
                }
            }}
        >
            <div className="edit-profile-modal">
                {/* Header */}
                <div className="edit-profile-header">
                    <h2>Edit Profile</h2>
                    <button onClick={onClose} className="close-button">
                        <Close />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    {/* Profile Picture */}
                    <div className="form-section">
                        <label className="profile-picture-section">
                            <img 
                                src={formData.picture || "https://via.placeholder.com/150"} 
                                alt="Profile" 
                                className="profile-picture-preview"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePictureUpload}
                                hidden
                            />
                            <span className="change-picture-text">Change Profile Picture</span>
                        </label>
                    </div>

                    {/* Name */}
                    <div className="form-section">
                        <label htmlFor="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Bio */}
                    <div className="form-section">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            rows="4"
                            className="form-textarea"
                        />
                    </div>

                    {/* Location */}
                    <div className="form-section">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                            className="form-input"
                        />
                    </div>

                    {/* Website */}
                    <div className="form-section">
                        <label htmlFor="website">Website</label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://yourwebsite.com"
                            className="form-input"
                        />
                    </div>

                    {/* Error Message */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}