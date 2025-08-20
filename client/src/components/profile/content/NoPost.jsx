import React from "react";

/**
 * Component displayed when a user has no posts to show
 */
export default function NoPost() {
  return (
    <div className="noPost-wrapper">
      {/* Line separator under profile */}
      <div className="profile-separator" />

      <div className="noPost-container">
        {/* Empty state message encouraging user to post */}
        <div className="noPost-text">
          <h2>Share Photos</h2>
          <p>When you share photos, they will appear on your profile.</p>
        </div>
        <div className="noPost-create-link">
          <a href="#">Share your first photo</a>
        </div>
      </div>
    </div>
  );
}