import React, { useEffect, useState } from "react";
import './NotificationModal.css';

import Close from "@mui/icons-material/Close";

/**
 * Modal component for displaying user notifications
 */
export default function NotificationModal({ onClose }) {

    // Mock notification data for testing
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

    // Handle clicking outside modal to close
    const onClickModal = (element) => {
        if (element.className === "notificationModal-container") {
            onClose();
        }
    };

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

    return(
        <div onClick={(e) => onClickModal(e.target)} className="notificationModal-container">
            {/* Close button */}
            <div onClick={() => onClose()} className="close-modal hoverable">
                <Close fontSize="large"/>
            </div>

            <div className="notification-modal">
                <div className="notification-top"> Notifications!</div>
                <div className="notification-content">
                    <div className="notifications">
                        {/* Render each notification item */}
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