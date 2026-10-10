import { useState } from 'react'
import { supabase } from './supabaseClient'

function BookingForm({ helper, user, onClose }) {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (!user) {
      setError('Please log in to book a helper.')
      return
    }

    setSubmitting(true)
    setError('')

    const { error } = await supabase.from('bookings').insert({
      helper_id: helper.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      start_date: date,
      notes: notes,
      user_id: user.id,
    })

    setSubmitting(false)

    if (error) {
      console.error('Supabase error:', error)
      setError('Something went wrong. Please try again.')
    } else {
      alert(`Booking request sent to ${helper.name}!`)
      onClose()
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Book {helper.name}</h3>
        <p>{helper.role} · {helper.location}</p>

        {!user && (
          <p style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
            You need to be logged in to book a helper. Please close this and log in first.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Your name
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </label>

          <label>
            Your phone number
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Start date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label>
            Notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requirements..."
            />
          </label>

          {error && <p style={{ color: '#f87171', fontSize: '0.9rem' }}>{error}</p>}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="book-btn" disabled={submitting || !user}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm