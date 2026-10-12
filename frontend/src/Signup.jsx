import { useState } from 'react'
import { supabase } from './supabaseClient'
import { cleanPhone, isValidPhone } from './phone'

function Signup({ onNavigate }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    password: '',
    email: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'phone' ? cleanPhone(value) : value })
  }

  const handleSignup = async (userType, destination) => {
    if (!form.email || !form.password || !form.fullName) {
      setMessage('Please fill in your name, email, and password first.')
      return
    }

    if (!isValidPhone(form.phone)) {
      setMessage('Please enter a valid 10-digit mobile number.')
      return
    }

    setSubmitting(true)
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: form.phone,
          user_type: userType,
        },
      },
    })

    setSubmitting(false)

    if (error) {
      setMessage(error.message)
      return
    }

    // Supabase returns a user with no identities when the email is already registered
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setMessage('An account with this email already exists. Please log in instead.')
      return
    }

    if (data.session) {
      onNavigate(destination)
    } else {
      setMessage('Account created! Check your email to confirm it, then log in.')
    }
  }

  const phoneOk = isValidPhone(form.phone)

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="tel"
        inputMode="numeric"
        name="phone"
        placeholder="10-digit mobile number"
        value={form.phone}
        onChange={handleChange}
        maxLength={10}
      />
      {form.phone.length > 0 && !phoneOk && (
        <p className="field-error">Enter a valid 10-digit mobile number.</p>
      )}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <h3>I want to...</h3>

      <button
        className="primary-btn"
        onClick={() => handleSignup('customer', 'browse')}
        disabled={submitting || !phoneOk}
      >
        {submitting ? 'Creating account...' : 'Hire Help'}
      </button>

      <button
        className="secondary-btn"
        onClick={() => handleSignup('helper', 'services')}
        disabled={submitting || !phoneOk}
      >
        {submitting ? 'Creating account...' : 'Offer My Services'}
      </button>

      {message && <p>{message}</p>}

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