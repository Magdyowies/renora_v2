import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import AdminLayout from "./layouts/AdminLayout";

// Pages
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import UsersPage from "./pages/Users";
import VehiclesPage from "./pages/Vehicles";
import BookingsPage from "./pages/Bookings";
import PaymentsPage from "./pages/Payments";
import PromosPage from "./pages/Promos";
import ReviewsPage from "./pages/Reviews";
import ReportsPage from "./pages/Reports";

/**
 * Admin-only route guard
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/login" element={<LoginPage />} />

          {/* ================= ADMIN PROTECTED ROUTES ================= */}
          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/promos" element={<PromosPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
