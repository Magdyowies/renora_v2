import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

import logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const navLinkClasses =
    "text-sm font-semibold text-neutral-800 hover:text-primary transition-colors";

  const mobileNavLinkClasses =
    "block py-2 text-base font-semibold text-neutral-800 hover:text-primary transition-colors";

  /* ================= Auth User Links ================= */
  const authUserLinks = (isMobile = false) => {
    const classes = isMobile ? mobileNavLinkClasses : navLinkClasses;

    return (
      <>
        <a href="/bookings" className={classes}>
          My Bookings
        </a>
        <a href="/profile" className={classes}>
          Profile
        </a>
        <a href="/wallet" className={classes}>
          Wallet
        </a>
        <button onClick={handleLogout} className={classes}>
          Logout
        </button>
      </>
    );
  };

  /* ================= Admin / Vendor Links ================= */
  const authAdminLinks = (isMobile = false) => {
    const classes = isMobile ? mobileNavLinkClasses : navLinkClasses;

    return (
      <>
        {(user?.role === "vendor" || user?.role === "admin") && (
          <a href="/vendor" className={classes}>
            Vendor Dashboard
          </a>
        )}
        {user?.role === "admin" && (
          <a href="/admin" className={classes}>
            Admin
          </a>
        )}
      </>
    );
  };

  return (
    <header className="sticky z-50 bg-white shadow-md">
      <div className="flex items-center justify-between">
        <a href="/">
          <img className="max-h-28 max-w-28" src={logo} alt="Vendor Logo" />
        </a>

        {/* ===== Desktop ===== */}
        <div className="mr-5 hidden items-center gap-5 md:flex">
          {!user ? (
            <>
              <a href="/vehicles" className={navLinkClasses}>
                Vehicles
              </a>
              <a href="/login" className={navLinkClasses}>
                Sign In
              </a>
              <a
                href="/register"
                className="bg-primary hover:bg-primary-dark rounded-md text-sm font-semibold transition-colors"
              >
                Sign Up
              </a>
            </>
          ) : (
            <>
              {authAdminLinks()}
              {authUserLinks()}
            </>
          )}
        </div>

        {/* ===== Mobile Toggle ===== */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mr-5 text-neutral-800 md:hidden"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* ===== Mobile Menu ===== */}
      {mobileMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="space-y-2 px-3 py-2">
            {!user ? (
              <>
                <a href="/vehicles" className={mobileNavLinkClasses}>
                  Vehicles
                </a>
                <a href="/login" className={mobileNavLinkClasses}>
                  Sign In
                </a>
                <a href="/register" className={mobileNavLinkClasses}>
                  Sign Up
                </a>
              </>
            ) : (
              <>
                {authAdminLinks(true)}
                {authUserLinks(true)}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
