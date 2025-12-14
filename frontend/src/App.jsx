import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Bookings from './pages/Bookings';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Chat from './pages/Chat';
import Wallet from './pages/Wallet';
import './index.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><Home /></>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/vehicles" element={<><Navbar /><Vehicles /></>} />
      <Route path="/vehicles/:id" element={<><Navbar /><VehicleDetail /></>} />
      <Route path="/bookings" element={<PrivateRoute><Navbar /><Bookings /></PrivateRoute>} />
      <Route path="/booking" element={<PrivateRoute><Navbar /><Booking /></PrivateRoute>} />
      <Route path="/payment/:bookingId" element={<PrivateRoute><Navbar /><Payment /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Navbar /><Chat /></PrivateRoute>} />
      <Route path="/wallet" element={<PrivateRoute><Navbar /><Wallet /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
