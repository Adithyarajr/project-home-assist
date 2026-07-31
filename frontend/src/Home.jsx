import { helpers } from "./mockData";
import HelperCard from "./HelperCard";

function Home({ onNavigate }) {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🏡 Trusted Across Bengaluru</span>

          <h1>
            Trusted Domestic Help,
            <br />
            Made Simple.
          </h1>

          <p>
            Find verified cooks, nannies, housekeepers and caregivers —
            all through one trusted platform.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => onNavigate("browse")}
            >
              Find a Helper
            </button>

            <button
              className="secondary-btn"
              onClick={() => onNavigate("services")}
            >
              List Your Services
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Why Choose Home Assist?</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>✅ Verified Helpers</h3>
            <p>Identity and background verification for every profile.</p>
          </div>

          <div className="feature-card">
            <h3>⭐ Trusted Reviews</h3>
            <p>Read genuine reviews from families before hiring.</p>
          </div>

          <div className="feature-card">
            <h3>🛡 Safe Hiring</h3>
            <p>Hire confidently with transparent information.</p>
          </div>

          <div className="feature-card">
            <h3>📅 Long-Term Support</h3>
            <p>Manage your bookings and helpers in one place.</p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="steps">
        <h2>How It Works</h2>

        <div className="steps-grid">

          <div className="step">
            <div className="step-number">1</div>
            <h3>Browse</h3>
            <p>Search verified helpers near you.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Connect</h3>
            <p>Compare profiles and choose the right fit.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Hire</h3>
            <p>Book interviews and manage everything in one place.</p>
          </div>

        </div>
      </section>

      {/* Featured Helpers */}
      <section className="featured">
        <h2>Featured Helpers</h2>

        <div className="helper-list">
          {helpers.slice(0, 3).map((helper) => (
            <HelperCard
              key={helper.id}
              helper={helper}
            />
          ))}
        </div>

        <button
          className="primary-btn"
          onClick={() => onNavigate("browse")}
        >
          Browse All Helpers
        </button>
      </section>
    </>
  );
}

export default Home;