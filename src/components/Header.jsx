import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/userContext";
function Header() {
  const navigate = useNavigate();
  const { loggedInUser, email } = useContext(UserContext);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");

    // Optionally, you can clear the context or redirect to login
    navigate("/");
  };
  const handleHome = () => {
    navigate("/home");
  };
  const handleFeed = () => {
    navigate("/feed");
  };

  return (
    <div>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-white">
          <span className="font-semibold">Welcome, {loggedInUser}!</span>
          <span className="ml-4">Email: {email}</span>
        </div>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleHome}
        >
          Home
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleFeed}
        >
          Feed Page
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Header;
