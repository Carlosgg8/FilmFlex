import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Close from "@mui/icons-material/Close";
import { userAPI } from "../../../services/api";
import { AuthContext } from "../../../context/authContext";
import "./FollowersModal.css";

/**
 * Modal component to display followers or following list
 */
export default function FollowersModal({ onClose, userId, initialTab = "followers" }) {
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followStates, setFollowStates] = useState({}); // Track follow state for each user

    useEffect(() => {
        fetchUserLists();
    }, [userId]);

    // Fetch followers and following lists
    const fetchUserLists = async () => {
        setLoading(true);
        try {
            const response = await userAPI.getUserById(userId);
            const userData = response.data;

            let followerDetails = [];
            let followingDetails = [];

            // Fetch detailed user info for followers
            if (userData.followers && userData.followers.length > 0) {
                followerDetails = await Promise.all(
                    userData.followers.map(id => userAPI.getUserById(id).catch(() => null))
                );
                setFollowers(followerDetails.filter(Boolean).map(res => res.data));
            }

            // Fetch detailed user info for following
            if (userData.following && userData.following.length > 0) {
                followingDetails = await Promise.all(
                    userData.following.map(id => userAPI.getUserById(id).catch(() => null))
                );
                setFollowing(followingDetails.filter(Boolean).map(res => res.data));
            }

            // Initialize follow states for all users
            // Check each user's followers array to see if current user is following them
            const allUsers = [...followerDetails, ...followingDetails]
                .filter(Boolean)
                .map(res => res.data);
            
            const states = {};
            allUsers.forEach(user => {
                if (user._id !== currentUser?.userId) {
                    // Check if current user is in this user's followers list
                    states[user._id] = user.followers?.includes(currentUser?.userId) || false;
                }
            });
            setFollowStates(states);

        } catch (error) {
            console.error("Error fetching user lists:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle profile navigation
    const handleUserClick = (clickedUserId) => {
        navigate(`/profile/${clickedUserId}`);
        onClose();
    };

    // Handle follow/unfollow
    const handleFollowToggle = async (targetUserId, e) => {
        e.stopPropagation();
        
        try {
            // Optimistic update
            setFollowStates(prev => ({
                ...prev,
                [targetUserId]: !prev[targetUserId]
            }));

            await userAPI.followUser(targetUserId);
        } catch (error) {
            console.error("Error toggling follow:", error);
            // Revert on error
            setFollowStates(prev => ({
                ...prev,
                [targetUserId]: !prev[targetUserId]
            }));
        }
    };

    // Handle clicking outside modal
    const handleBackdropClick = (e) => {
        if (e.target.classList.contains("followers-modal-container")) {
            onClose();
        }
    };

    // Render user list item
    const renderUserItem = (user) => {
        const isCurrentUser = user._id === currentUser?.userId;
        const isFollowing = followStates[user._id];

        return (
            <div 
                key={user._id} 
                className="user-list-item"
                onClick={() => handleUserClick(user._id)}
            >
                <img 
                    src={user.picture || "https://via.placeholder.com/150"} 
                    alt={user.username}
                    className="user-list-avatar"
                />
                <div className="user-list-info">
                    <div className="user-list-username">{user.username}</div>
                    <div className="user-list-name">{user.name}</div>
                </div>
                {!isCurrentUser && (
                    <button
                        className={`follow-list-btn ${isFollowing ? 'following' : ''}`}
                        onClick={(e) => handleFollowToggle(user._id, e)}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>
        );
    };

    const currentList = activeTab === "followers" ? followers : following;

    return (
        <div className="followers-modal-container" onClick={handleBackdropClick}>
            <div className="followers-modal">
                {/* Header */}
                <div className="followers-modal-header">
                    <div className="followers-modal-tabs">
                        <button
                            className={`tab-btn ${activeTab === "followers" ? "active" : ""}`}
                            onClick={() => setActiveTab("followers")}
                        >
                            Followers ({followers.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "following" ? "active" : ""}`}
                            onClick={() => setActiveTab("following")}
                        >
                            Following ({following.length})
                        </button>
                    </div>
                    <Close 
                        className="close-btn" 
                        onClick={onClose}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                {/* Content */}
                <div className="followers-modal-content">
                    {loading ? (
                        <div className="loading-state">Loading...</div>
                    ) : currentList.length === 0 ? (
                        <div className="empty-state">
                            No {activeTab === "followers" ? "followers" : "following"} yet
                        </div>
                    ) : (
                        currentList.map(renderUserItem)
                    )}
                </div>
            </div>
        </div>
    );
}
