function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        onClick={() => onNavigate("home")}
        style={{ cursor: "pointer" }}
      >
        Project Home Assist
      </div>

      <div className="navbar-links">

        <button
          className={`navbar-link ${currentPage === "home" ? "active" : ""}`}
          onClick={() => onNavigate("home")}
        >
          Home
        </button>

        <button
          className={`navbar-link ${currentPage === "browse" ? "active" : ""}`}
          onClick={() => onNavigate("browse")}
        >
          Browse Helpers
        </button>

        <button
          className={`navbar-link ${currentPage === "services" ? "active" : ""}`}
          onClick={() => onNavigate("services")}
        >
          List Your Services
        </button>

        <button
          className={`nav-btn dashboard-btn ${
            currentPage === "bookings" ? "active" : ""
          }`}
          onClick={() => onNavigate("bookings")}
        >
          Dashboard
        </button>

        <button
          className="nav-btn login-btn"
          onClick={() => onNavigate("login")}
        >
          Login
        </button>

        <button
          className="nav-btn signup-btn"
          onClick={() => onNavigate("signup")}
        >
          Sign Up
        </button>

      </div>
    </nav>
  );
}

export default Navbar;