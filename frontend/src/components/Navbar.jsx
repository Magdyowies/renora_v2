import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut, MessageCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Rentora</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/vehicles" className="text-gray-700 hover:text-primary-600 transition">
              Vehicles
            </Link>
            {user ? (
              <>
                <Link to="/bookings" className="text-gray-700 hover:text-primary-600 transition">
                  My Bookings
                </Link>
                <Link to="/chat" className="text-gray-700 hover:text-primary-600 transition">
                  <MessageCircle className="h-5 w-5" />
                </Link>
                {user.role === 'vendor' && (
                  <Link to="/vendor" className="text-gray-700 hover:text-primary-600 transition">
                    Vendor Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition">
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <User className="h-5 w-5" />
                    <span>{user.first_name || user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/wallet" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Wallet
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <Link to="/vehicles" className="block py-2 text-gray-700">Vehicles</Link>
            {user ? (
              <>
                <Link to="/bookings" className="block py-2 text-gray-700">My Bookings</Link>
                <Link to="/chat" className="block py-2 text-gray-700">Chat Support</Link>
                <Link to="/wallet" className="block py-2 text-gray-700">Wallet</Link>
                <Link to="/profile" className="block py-2 text-gray-700">Profile</Link>
                {user.role === 'vendor' && (
                  <Link to="/vendor" className="block py-2 text-gray-700">Vendor Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link to="/vendor" className="block py-2 text-gray-700">Vendor Dashboard</Link>
                    <Link to="/admin" className="block py-2 text-gray-700">Admin Dashboard</Link>
                  </>
                )}
                <button onClick={handleLogout} className="block py-2 text-gray-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700">Sign In</Link>
                <Link to="/register" className="block py-2 text-primary-600">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
