import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import api from "../../../services/api";
import "./UsernameSetup.css";

/**
 * Component for setting up a username for users who don't have one yet
 */
export default function UsernameSetup() {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (user && user.username) return null; // Already has a username

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/users/set-username", { username });
      // Update user in context and localStorage
      login(localStorage.getItem("jwt"), response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Username taken or error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="username-setup-overlay">
      <div className="username-setup-modal">
        <h2>Welcome to Film Flex!</h2>
        <p>Please choose a unique username to get started</p>
        <form onSubmit={handleSubmit} className="username-setup-form">
          <input
            type="text"
            placeholder="Enter username..."
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            title="Username can only contain letters, numbers, and underscores"
            className="username-input"
            disabled={isLoading}
          />
          <button type="submit" className="username-submit-btn" disabled={isLoading}>
            {isLoading ? "Setting up..." : "Continue"}
          </button>
          {error && <div className="username-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}