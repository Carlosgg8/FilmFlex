import React, { useEffect, useState } from "react";
import { userAPI } from "../services/api";
import NavBar from "../components/NavBar";
import PostModal from "../components/modals/PostModal/PostModal";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import '../styles/savedPosts.css';

/**
 * Saved Posts page - displays all posts bookmarked by the user
 */
export default function SavedPosts() {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);

    // Fetch saved posts on mount
    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const response = await userAPI.getSavedPosts();
                setSavedPosts(response.data);
            } catch (error) {
                console.error('Error fetching saved posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, []);

    // Handle post selection
    const handleSelectPost = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    // Handle removing a post from saved (when unbookmarked in modal)
    const handlePostUpdate = async () => {
        // Refetch saved posts to update the list
        try {
            const response = await userAPI.getSavedPosts();
            setSavedPosts(response.data);
        } catch (error) {
            console.error('Error refetching saved posts:', error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="saved-posts-container">
                <div className="saved-posts-header">
                    <h1>Saved Posts</h1>
                    <p>{savedPosts.length} {savedPosts.length === 1 ? 'post' : 'posts'} saved</p>
                </div>

                {loading ? (
                    <div className="saved-posts-loading">Loading...</div>
                ) : savedPosts.length === 0 ? (
                    <div className="saved-posts-empty">
                        <div className="empty-state">
                            <h2>No saved posts yet</h2>
                            <p>Posts you bookmark will appear here</p>
                        </div>
                    </div>
                ) : (
                    <div className="saved-posts-grid">
                        {savedPosts.map((post) => (
                            <div 
                                key={post._id} 
                                className="saved-post-card"
                                onClick={() => handleSelectPost(post)}
                            >
                                <img 
                                    src={post.poster || post.imageURL} 
                                    alt={post.movieTitle || 'Post'}
                                    className="saved-post-image"
                                />
                                <div className="saved-post-overlay">
                                    <div className="saved-post-info">
                                        <span className="post-likes">❤️ {post.likes?.length || 0}</span>
                                        <span className="post-comments">💬 {post.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Modal */}
            {isModalOpen && selectedPost && (
                <PostModal
                    onClose={() => {
                        handleCloseModal();
                        handlePostUpdate(); // Refresh saved posts when modal closes
                    }}
                    post={selectedPost}
                    user={user}
                />
            )}
        </div>
    );
}
