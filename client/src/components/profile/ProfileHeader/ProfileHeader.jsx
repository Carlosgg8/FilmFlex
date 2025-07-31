import React from "react";
import './ProfileHeader.css';

export default function ProfileHeader( {user} ) { 
    return(
        
            <div className="header-container">
                <div className="header-left">
                    <img className="profile-photo" src={user.picture} alt={user.name} />
                </div>

                <div className="header-right">
                    <div className="user-info">
                        <h2 className="username">{user.username} </h2>
                        <button className="follow-btn">Follow</button>
                    </div>
                    
                    <div className="user-counts">
                        <span><strong>1,208</strong> posts</span>
                        <span><strong>3M</strong> followers</span>
                        <span><strong>880</strong> following</span>
                    </div>
                    
                    <div className="user-description">
                        <strong className="display-name">Alexandra Madison</strong>
                        <p>🎤 Host of a podcast</p>
                        <p>📍 Based in NY</p>
                        <a href="#" className="profile-link">alexjon.com/links</a>
                    </div>
                </div>
            </div>
       
    );
}