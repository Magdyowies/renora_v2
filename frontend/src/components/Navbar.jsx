import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = "text-sm font-semibold text-neutral-800 hover:text-primary transition-colors";
  const mobileNavLinkClasses = "block py-2 text-base font-semibold text-neutral-800 hover:text-primary transition-colors";

  const renderAuthLinks = (isMobile = false) => {
    const linkClasses = isMobile ? mobileNavLinkClasses : navLinkClasses;
    return (
      <>
        <Link to="/vehicles" className={linkClasses} onClick={() => setMobileMenuOpen(false)}>
          Vehicles
        </Link>
        {user ? (
          <>
            <Link to="/bookings" className={linkClasses} onClick={() => setMobileMenuOpen(false)}>
              My Bookings
            </Link>
            {(user.role === 'vendor' || user.role === 'admin') && (
              <Link to="/vendor" className={linkClasses} onClick={() => setMobileMenuOpen(false)}>
                Vendor Dashboard
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className={linkClasses} onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
            {!isMobile && (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm font-semibold text-neutral-800 hover:text-primary">
                  <User className="h-5 w-5" />
                  <span>{user.first_name || user.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary">
                    Profile
                  </Link>
                  <Link to="/wallet" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary">
                    Wallet
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
            {isMobile && (
              <>
                <Link to="/profile" className={linkClasses} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <Link to="/wallet" className={linkClasses} onClick={() => setMobileMenuOpen(false)}>Wallet</Link>
                <button onClick={handleLogout} className={linkClasses}>Logout</button>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className={linkClasses} onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
            <Link
              to="/register"
              className={`text-sm font-semibold text-white bg-primary px-4 py-2 rounded-md hover:bg-primary-dark transition-colors ${isMobile ? 'block text-center' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-neutral-900">Rentora</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {renderAuthLinks()}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-800 hover:text-primary">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderAuthLinks(true)}
          </div>
        </div>
      )}
    </header>
  );
}
