import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import Login from "./pages/Login";
import Feed from "./pages/Feed";

//import Dashboard from "./pages/Feed";
import './App.css';;

function App() {
  const { isAuthenticated } = useContext(AuthContext);

 return (
    <div className="App">
      <div className="Container">
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
 