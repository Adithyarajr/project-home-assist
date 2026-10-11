import { useState } from 'react'
import { supabase } from './supabaseClient'

function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })

    setSubmitting(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('If an account exists for that email, a reset link is on its way. Check your inbox.')
  }

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your account email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="primary-btn" type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </button>

        {message && <p>{message}</p>}
      </form>

      <p className="auth-footer">
        Remembered it?{' '}
        <span className="link-text" onClick={() => onNavigate('login')}>
          Back to Login
        </span>
      </p>
    </div>
  )
}

export default ForgotPassword