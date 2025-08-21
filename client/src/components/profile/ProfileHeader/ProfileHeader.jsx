import React from "react";
import './ProfileHeader.css';

/**
 * Profile header component displaying user info, stats, and bio
 */
export default function ProfileHeader( { user = {}, postCount = 0 } ) { 
    //console.log("User object in ProfileHeader:", user);
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
                        <button className="follow-btn">Follow</button>
                    </div>
                    
                    {/* Engagement statistics */}
                    <div className="user-counts">
                        <span><strong>{postCount.toLocaleString()}</strong> posts</span>
                        <span><strong>{(user.followers?.length || 0).toLocaleString()}</strong> followers</span>
                        <span><strong>{(user.following?.length || 0).toLocaleString()}</strong> following</span>
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