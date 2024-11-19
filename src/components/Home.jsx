import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/userContext";
import Header from "./Header";
import CreatePost from "./PostForm";
import Toastify from "./Toastify";
function Home() {
  const navigate = useNavigate();
  const { loggedInUser, email } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div>
      <Header />
      <CreatePost />
    </div>
  );
}

export default Home;
