import { useState } from 'react'

function BookingForm({ helper, onClose }) {
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    alert(`Booking confirmed with ${helper.name} for ${date}!`)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Book {helper.name}</h3>
        <p>{helper.role} · {helper.location}</p>

        <form onSubmit={handleSubmit}>
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

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="book-btn">
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm