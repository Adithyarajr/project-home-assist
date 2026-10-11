import { useState } from 'react'
import { supabase } from './supabaseClient'

function ResetPassword({ onNavigate }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (password.length < 6) {
      setMessage('Your password needs at least 6 characters.')
      return
    }

    if (password !== confirm) {
      setMessage('The two passwords do not match.')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.auth.updateUser({ password })

    setSubmitting(false)

    if (error) {
      setMessage(error.message)
      return
    }

    alert('Your password has been updated.')
    onNavigate('home')
  }

  return (
    <div className="auth-container">
      <h2>Choose a New Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button className="primary-btn" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Update password'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  )
}

export default ResetPassword