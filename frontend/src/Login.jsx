function Login({ onNavigate }) {
  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input type="text" placeholder="Phone Number" />
      <input type="password" placeholder="Password" />

      <button className="primary-btn">Login</button>

      <p className="auth-footer">
        Don't have an account?{' '}
        <span className="link-text" onClick={() => onNavigate('signup')}>
          Sign Up
        </span>
      </p>
    </div>
  )
}

export default Login