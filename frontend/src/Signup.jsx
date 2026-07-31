function Signup({ onNavigate }) {
  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <input type="text" placeholder="Full Name" />
      <input type="text" placeholder="Phone Number" />
      <input type="password" placeholder="Password" />

      <h3>I want to...</h3>

      <button className="primary-btn">
        Hire Help
      </button>

      <button className="secondary-btn">
        Offer My Services
      </button>

      <p className="auth-footer">
        Already have an account?{' '}
        <span className="link-text" onClick={() => onNavigate('login')}>
          Login
        </span>
      </p>
    </div>
  )
}

export default Signup