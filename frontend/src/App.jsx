import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Chat from "./pages/Chat";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";
import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";

function VendorRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "vendor" && user.role !== "admin")
    return <Navigate to="/" />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (user.admin) return <NotFound />;

  return children;
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/vehicles",
        element: <Vehicles />,
      },
      {
        path: "/vehicles/:id",
        element: <VehicleDetail />,
      },
      {
        path: "/bookings",
        element: (
          <PrivateRoute>
            <Bookings />
          </PrivateRoute>
        ),
      },
      {
        path: "/booking",
        element: (
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment/:bookingId",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "/chat",
        element: (
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        ),
      },
      {
        path: "/wallet",
        element: (
          <PrivateRoute>
            <Wallet />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/vendor",
        element: (
          <VendorRoute>
            <VendorDashboard />
          </VendorRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
    ],
  },

  // routes without Navbar
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
