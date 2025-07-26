import React, { useState } from "react";
import './NotificationModal.css';

import Close from "@mui/icons-material/Close";

export default function NotificationModal({ onClose }) {

    const testNoti = [
        {
            id: 1,
            user: "Alice",
            message: "User123 liked your post", 
            time: "2m ago", 
            read: false
        },
        {
            id: 2,
            user: "jow",
            message: "carl liked your post", 
            time: "2m ago", 
            read: true
        },

    ];

    const onClickModal = (element) => {
        if (element.className === "notificationModal-container") {
            onClose();
        }
    };

    return(
        <div onClick={(e) => onClickModal(e.target)} className="notificationModal-container">
            <div onClick={() => onClose()} className="close-modal hoverable">
                <Close fontSize="large"/>
            </div>

            <div className="notification-modal">
                <div className="notification-top"> Notifications!</div>
                <div className="notification-content">
                    <div className="notifications">
                        {testNoti.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <p><strong>{notification.user}</strong>: {notification.message}</p>
                                <span className="time">{notification.time}</span>
                            </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );

}