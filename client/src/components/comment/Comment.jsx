import React from "react";

import './Comment.css'

export default function CommentItem({comment}){
    return(
        <div className="comment-container">
                <img className="profile-image hoverable" src={comment.profile_image_url}/>
                <div>
                    <div>
                        <span className="modal-username hoverable">{comment.profile_name}</span>
                        <span className="">{comment.message}</span>
                    </div>
                    <div className="comment-details ">
                        {comment.likes > 0 && (
                            <span className="hoverable">
                                {comment.likes} {comment.likes > 1 ? "likes" : "like"}
                            </span>
                            )}
                        <span className="hoverable">Reply</span>
                    </div>
                </div>

        </div>
    );
}