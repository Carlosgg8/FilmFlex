import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import Login from "./pages/login";
import Feed from "./pages/Feed";
import NavBar from "./components/NavBar.jsx";
import MessagePage from "./pages/messages.jsx"
import ProfilePage from "./pages/profile.jsx";
import CreatePost from "./pages/createPost.jsx";

//import Dashboard from "./pages/Feed";
import './App.css';;

function App() {
  const { isAuthenticated } = useContext(AuthContext);

 return (
    <div className="App">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/feed" /> : <Login />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/feed" /> : <Login />}
          />
          <Route
            path="/feed"
            element={isAuthenticated ? <Feed /> : <Navigate to="/login" />}
          />
          <Route path="/messagePage" element={<MessagePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          
        </Routes>

    </div>
  );
}

export default App;
 