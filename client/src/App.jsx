import { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import Login from "./pages/login";
import Feed from "./pages/Feed";
import NavBar from "./components/NavBar.jsx";
import MessagePage from "./pages/messages.jsx"
import ProfilePage from "./pages/profile.jsx";
import CreatePost from "./pages/createPost.jsx";
import UsernameSetup from "./components/login/Username/UsernameSetup.jsx";
import Signup from "./pages/signup.jsx";

//import Dashboard from "./pages/Feed";
import './App.css';;

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  // Enhanced auth verification
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    // Additional check for protected routes
    const protectedRoutes = ['/feed', '/messagePage', '/profile', '/create-post'];
    const isProtectedRoute = protectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    if (isProtectedRoute && !token) {
      window.location.replace('/login');
      return;
    }

    setAuthChecked(true);
  }, [location]);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">

      {isAuthenticated && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/feed" replace /> : <Login />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/feed" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/feed" replace /> : <Signup/> }
        />
        <Route
          path="/feed"
          element={isAuthenticated ? <Feed /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/messagePage" 
          element={isAuthenticated ? <MessagePage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile/:userId" 
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/create-post" 
          element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
