// src/App.tsx
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
} from "react-router-dom";

import LoginPage from "./components/login-page";
import OTPPage from "./components/otp-page";
import UserDetailsPage from "./components/user-details-page";
import Dashboard from "./components/dashboard";
import AdminActivityPage from "./components/admin-activity-page";

type UserDetails = {
  name: string;
} | null;

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  isAllowed,
  redirectPath = "/login",
  children,
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

function AppRoutes() {
  // Initialize state from localStorage ✅
  const [phoneNumber, setPhoneNumber] = useState(() => {
    return localStorage.getItem("phoneNumber") || "";
  });
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem("isGuest") === "true";
  });
  const [userDetails, setUserDetails] = useState<UserDetails>(() => {
    const stored = localStorage.getItem("userDetails");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  // Effect to sync state changes to localStorage (optional, but specific handlers below are better for specific actions)
  useEffect(() => {
    // We handle setting storage in the action handlers for explicit control
  }, []);

  const handleLogin = (phone: string, guest?: boolean) => {
    if (guest) {
      setIsGuest(true);
      setPhoneNumber("");
      localStorage.setItem("isGuest", "true");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("userDetails");
      navigate("/dashboard");
      return;
    }

    setIsGuest(false);
    setPhoneNumber(phone);
    // Don't save to localStorage yet! Wait for OTP verification.
    navigate("/otp");
  };

  const handleVerifyOtp = () => {
    // NOW we are verified, so we can persist the phone number
    localStorage.setItem("phoneNumber", phoneNumber);
    localStorage.setItem("isGuest", "false");
    navigate("/details");
  };

  const handleCompleteDetails = (details: {
    name: string;
  }) => {
    setUserDetails(details);
    localStorage.setItem("userDetails", JSON.stringify(details));
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setPhoneNumber("");
    setUserDetails(null);
    setIsGuest(false);
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("isGuest");
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={userDetails || isGuest ? "/dashboard" : "/login"} replace />} />
      <Route path="/admin/activity" element={<AdminActivityPage />} />

      {/* Public Route (Login) - redirects to dashboard ONLY if fully logged in (guest or has details) */}
      <Route
        path="/login"
        element={
          (userDetails || isGuest) ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
        }
      />

      {/* Protected Routes */}

      {/* OTP only accessible if phone number is set */}
      <Route
        path="/otp"
        element={
          <ProtectedRoute isAllowed={!!phoneNumber}>
            <OTPPage phoneNumber={phoneNumber} onVerify={handleVerifyOtp} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/details"
        element={
          <ProtectedRoute isAllowed={!!phoneNumber}>
            <UserDetailsPage
              phoneNumber={phoneNumber}
              onComplete={handleCompleteDetails}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAllowed={!!userDetails || isGuest}>
            <Dashboard
              phoneNumber={phoneNumber}
              isGuest={isGuest}
              userDetails={userDetails || undefined}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppRoutes />
  );
}
