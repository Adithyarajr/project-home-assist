function MyBookings({ onNavigate }) {
  return (
    <main>
      <div className="gate-card">
        <div className="gate-icon">🔒</div>
        <h2>Sign in to view your Dashboard</h2>
        <p>
          Track your bookings, manage requests, and stay updated —
          all in one place once you're signed in.
        </p>
        <button
          className="primary-btn gate-btn"
          onClick={() => onNavigate('login')}
        >
          Sign In
        </button>
        <p className="auth-footer">
          Don't have an account?{' '}
          <span className="link-text" onClick={() => onNavigate('signup')}>
            Sign Up
          </span>
        </p>
      </div>
    </main>
  )
}

export default MyBookings