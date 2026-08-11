import { useState } from 'react'
import { supabase } from './supabaseClient'

function BookingForm({ helper, onClose }) {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const { error } = await supabase.from('bookings').insert({
      helper_id: helper.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      start_date: date,
      notes: notes,
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
            <button type="submit" className="book-btn" disabled={submitting}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm