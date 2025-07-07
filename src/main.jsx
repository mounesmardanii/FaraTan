import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { ReservationProvider } from "./context/ReservationContext";
import { PurchaseProvider } from "./context/PurchaseContext"; // ✅ اضافه شده
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProfileProvider>
          <ReservationProvider>
            <PurchaseProvider>
              {" "}
              {/* ✅ افزودن لایه خرید */}
              <App />
            </PurchaseProvider>
          </ReservationProvider>
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
