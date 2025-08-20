import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import api from "../../../services/api";

/**
 * Component for setting up a username for users who don't have one yet
 */
export default function UsernameSetup() {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  if (user && user.username) return null; // Already has a username

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/user/set-username", { username });
      // Update user in context and localStorage
      login(localStorage.getItem("jwt"), response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Username taken or error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Choose a unique username:
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </label>
      <button type="submit">Save</button>
      {error && <div style={{color: "red"}}>{error}</div>}
    </form>
  );
}