import { useState } from 'react'
import { supabase } from './supabaseClient'

function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setSubmitting(false)

    if (error) {
      setMessage(error.message)
      return
    }

    onNavigate('home')
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="primary-btn" type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>

        {message && <p>{message}</p>}
      </form>

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