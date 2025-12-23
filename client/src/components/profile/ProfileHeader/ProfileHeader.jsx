import React, { useState, useEffect } from "react";
import { userAPI } from "../../../services/api";
import './ProfileHeader.css';

/**
 * Profile header component displaying user info, stats, and bio
 */
export default function ProfileHeader( { user = {}, postCount = 0, isOwnProfile = false, loggedInUser = {} } ) { 
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    // Check if logged-in user is following this profile
    useEffect(() => {
        if (loggedInUser?.userId && user?.followers) {
            setIsFollowing(user.followers.includes(loggedInUser.userId));
        }
        setFollowerCount(user.followers?.length || 0);
        setFollowingCount(user.following?.length || 0);
    }, [user, loggedInUser]);

    // Handle follow/unfollow
    const handleFollowClick = async () => {
        try {
            // Optimistic update
            setIsFollowing(!isFollowing);
            setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);

            // API call
            const response = await userAPI.followUser(user._id);
            
            // Update with actual counts from server
            if (response.data?.targetUser) {
                setFollowerCount(response.data.targetUser.followers.length);
            }
        } catch (err) {
            console.error('Error toggling follow:', err);
            // Revert on error
            setIsFollowing(isFollowing);
            setFollowerCount(user.followers?.length || 0);
        }
    };

    // Determine button text
    const getButtonText = () => {
        if (isFollowing) {
            // Check if they follow back
            const isFollowingBack = user.following?.includes(loggedInUser.userId);
            return isFollowingBack ? "Following" : "Following";
        }
        // Check if they follow you (not following them yet)
        const followsYou = user.following?.includes(loggedInUser.userId);
        return followsYou ? "Follow Back" : "Follow";
    };

    return(
        
            <div className="header-container">
                {/* Left side - Profile picture */}
                <div className="header-left">
                    <img className="profile-photo" 
                        src={user.picture || "https://via.placeholder.com/150/0000FF/FFFFFF?text=No+Pic"} 
                        alt={user.name || "User"} 
                    />
                </div>

                {/* Right side - User info and stats */}
                <div className="header-right">
                    {/* Username and follow button */}
                    <div className="user-info">
                        <h2 className="username">{user.username} </h2>
                        {!isOwnProfile && (
                            <button 
                                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                onClick={handleFollowClick}
                            >
                                {getButtonText()}
                            </button>
                        )}
                    </div>
                    
                    {/* Engagement statistics */}
                    <div className="user-counts">
                        <span><strong>{postCount.toLocaleString()}</strong> posts</span>
                        <span><strong>{followerCount.toLocaleString()}</strong> followers</span>
                        <span><strong>{followingCount.toLocaleString()}</strong> following</span>
                    </div>
                    
                    {/* Bio and additional user details */}
                    <div className="user-description">
                        <strong className="display-name">{user.name || 'Display Name'}</strong>
                        {user.bio && <p>{user.bio}</p>}
                        {user.location && <p>📍 {user.location}</p>}
                        {/* Website link */}
                        {user.website && (
                            <a 
                                href={user.website} 
                                className="profile-link"
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {user.website.replace(/(^\w+:|^)\/\//, '')}
                            </a>
                        )}

                    </div>
                </div>
            </div>
       
    );
}