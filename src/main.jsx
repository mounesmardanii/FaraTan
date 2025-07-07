import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProfileProvider>
          {" "}
          {/* 👈 این خط را اضافه کن */}
          <App />
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
