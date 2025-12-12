// src/App.tsx
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import LoginPage from "./components/login-page";
import OTPPage from "./components/otp-page";
import UserDetailsPage from "./components/user-details-page";
import Dashboard from "./components/dashboard";

type UserDetails = {
  firstName: string;
  lastName: string;
  place: string;
} | null;

function AppRoutes() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>(null);

  const navigate = useNavigate();

  const handleLogin = (phone: string, guest?: boolean) => {
    if (guest) {
      setIsGuest(true);
      setPhoneNumber("");
      navigate("/dashboard");
      return;
    }

    setIsGuest(false);
    setPhoneNumber(phone);
    navigate("/otp");
  };

  const handleVerifyOtp = () => {
    navigate("/details");
  };

  const handleCompleteDetails = (details: {
    firstName: string;
    lastName: string;
    place: string;
  }) => {
    setUserDetails(details);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setPhoneNumber("");
    setUserDetails(null);
    setIsGuest(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      <Route
        path="/otp"
        element={
          <OTPPage phoneNumber={phoneNumber} onVerify={handleVerifyOtp} />
        }
      />

      <Route
        path="/details"
        element={
          <UserDetailsPage
            phoneNumber={phoneNumber}
            onComplete={handleCompleteDetails}
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          <Dashboard
            phoneNumber={phoneNumber}
            isGuest={isGuest}
            userDetails={userDetails || undefined}
            onLogout={handleLogout}
          />
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
      <AppRoutes />
  );
}
