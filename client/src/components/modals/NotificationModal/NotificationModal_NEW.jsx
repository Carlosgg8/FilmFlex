import React, { useEffect, useState } from "react";
import './NotificationModal.css';
import { notificationAPI } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Close from "@mui/icons-material/Close";
import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";
import PersonAdd from "@mui/icons-material/PersonAdd";

dayjs.extend(relativeTime);

/**
 * Modal component for displaying user notifications
 */
export default function NotificationModal({ onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch notifications on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await notificationAPI.getNotifications();
                setNotifications(response.data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Handle clicking a notification
    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.read) {
            try {
                await notificationAPI.markAsRead(notification._id);
                setNotifications(prev => 
                    prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
                );
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }

        // Navigate based on notification type
        if (notification.post) {
            onClose();
        } else if (notification.type === 'follow') {
            navigate(`/profile/${notification.sender._id}`);
            onClose();
        }
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    // Handle delete notification
    const handleDelete = async (notificationId, e) => {
        e.stopPropagation();
        try {
            await notificationAPI.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    // Get icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <Favorite fontSize="small" style={{ color: '#e91e63' }} />;
            case 'comment':
                return <ModeComment fontSize="small" style={{ color: '#2196f3' }} />;
            case 'follow':
                return <PersonAdd fontSize="small" style={{ color: '#4caf50' }} />;
            default:
                return null;
        }
    };

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
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = scrollbarWidth + "px";
        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, []);

    return(
        <div onClick={(e) => onClickModal(e.target)} className="notificationModal-container">
            <div onClick={() => onClose()} className="close-modal hoverable">
                <Close fontSize="large"/>
            </div>

            <div className="notification-modal">
                <div className="notification-header">
                    <div className="notification-top">Notifications</div>
                    {notifications.some(n => !n.read) && (
                        <button onClick={handleMarkAllAsRead} className="mark-all-read-btn">
                            Mark all as read
                        </button>
                    )}
                </div>
                <div className="notification-content">
                    {loading ? (
                        <div className="notification-loading">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="notification-empty">No notifications yet</div>
                    ) : (
                        <div className="notifications">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification._id} 
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <img 
                                        src={notification.sender?.picture || 'https://via.placeholder.com/40'} 
                                        alt={notification.sender?.username}
                                        className="notification-avatar"
                                    />
                                    <div className="notification-info">
                                        <p>
                                            <strong>{notification.sender?.username || 'Someone'}</strong> {notification.message}
                                        </p>
                                        <span className="time">{dayjs(notification.createdAt).fromNow()}</span>
                                    </div>
                                    <button 
                                        className="notification-delete"
                                        onClick={(e) => handleDelete(notification._id, e)}
                                        title="Delete"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
