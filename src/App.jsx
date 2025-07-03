import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import LoginFormPage from "./pages/LoginFormPage";
import RegisterInfoPage from "./pages/RegisterInfoPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import CoachProfile from "./pages/CoachProfile";
import StartTraining from "./pages/StartTraining";
import OneYearPlan from "./pages/TrainingPlans/OneYearPlan";
import SixMonthPlan from "./pages/TrainingPlans/SixMonthPlan";
import ThreeMonthPlan from "./pages/TrainingPlans/ThreeMonthPlan";
import DashboardPage from "./admin/pages/DashpoardPage"; // پنل ادمین
import ProfilePage from "./pages/ProfilePage";
import MyReservations from "./pages/MyReservations";
import MyPurchases from "./pages/MyPurchases";

function LayoutWrapper() {
  const location = useLocation();

  const hideLayout = [
    "/login",
    "/signup",
    "/verify",
    "/loginform",
    "/register-info",
    "/forgot-password",
    "/new-password",
    "/admin", // صفحه ادمین بدون Navbar و Footer
  ].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="/loginform" element={<LoginFormPage />} />
        <Route path="/register-info" element={<RegisterInfoPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/start-training" element={<StartTraining />} />
        <Route path="/coach-profile" element={<CoachProfile />} />
        <Route path="/plan/1year" element={<OneYearPlan />} />
        <Route path="/plan/6months" element={<SixMonthPlan />} />
        <Route path="/plan/3months" element={<ThreeMonthPlan />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return <LayoutWrapper />;
}

export default App;
