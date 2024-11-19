import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../utils/userContext";

function Login({ setUserName, setEmail }) {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    navigate("/");
  }

  const handleLoginSuccess = (credentialResponse) => {
    if (credentialResponse && credentialResponse.credential) {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);
      setUserName(decoded.name);
      setEmail(decoded.email);
      localStorage.setItem("token", token);
      localStorage.setItem("userName", decoded.name);
      localStorage.setItem("email", decoded.email);

      navigate("/home");
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Welcome to City Specials
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign in to create posts, explore special places, and engage with the
          community!
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-md mb-8">
          <p className="text-sm font-medium">
            <strong>Note:</strong> You need to sign in to create posts and view
            the latest content.
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </div>

        <div className="text-center text-gray-500 text-sm mt-4">
          <p>
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
