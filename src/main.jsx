import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="937958912667-ohqr0qo8fbdv6e17aqpur883qnki4pek.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
