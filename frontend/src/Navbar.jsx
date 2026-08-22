import { useState } from "react";
import { supabase } from "./supabaseClient";

function Navbar({ currentPage, onNavigate, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function go(page) {
    onNavigate(page);
    setMenuOpen(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    onNavigate("home");
  }

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        onClick={() => go("home")}
        style={{ cursor: "pointer" }}
      >
        Project Home Assist
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <button
          className={`navbar-link ${currentPage === "home" ? "active" : ""}`}
          onClick={() => go("home")}
        >
          Home
        </button>

        <button
          className={`navbar-link ${currentPage === "browse" ? "active" : ""}`}
          onClick={() => go("browse")}
        >
          Browse Helpers
        </button>

        <button
          className={`navbar-link ${currentPage === "services" ? "active" : ""}`}
          onClick={() => go("services")}
        >
          List Your Services
        </button>

        <button
          className={`nav-btn dashboard-btn ${currentPage === "bookings" ? "active" : ""}`}
          onClick={() => go("bookings")}
        >
          Dashboard
        </button>

        {user ? (
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <button className="nav-btn login-btn" onClick={() => go("login")}>
              Login
            </button>

            <button className="nav-btn signup-btn" onClick={() => go("signup")}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;