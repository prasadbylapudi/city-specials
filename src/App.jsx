import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./utils/userContext";
import Login from "./components/Login";
import Home from "./components/Home";
import PostsFeed from "./components/FeedData";
function App() {
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [email, setEmail] = useState(localStorage.getItem("email"));

  useEffect(() => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("email", email);
  }, [userName, email]);

  return (
    <UserContext.Provider value={{ loggedInUser: userName, email: email }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Login setUserName={setUserName} setEmail={setEmail} />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/feed" element={<PostsFeed />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
