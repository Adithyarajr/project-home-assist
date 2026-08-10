import { useState } from 'react'
import BookingForm from './BookingForm'
import HelperDetail from './HelperDetail'

function HelperCard({ helper }) {
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  return (
    <>
      <div className="helper-card" onClick={() => setShowDetail(true)}>
        <img src={helper.photo_url} alt={helper.name} className="helper-photo" />
        <h3>{helper.name}</h3>
        <p>{helper.role} · {helper.experience}</p>
        <p>{helper.location}</p>
        <p className="rating">⭐ {helper.rating}</p>
        <p>{helper.phone}</p>
        {helper.verified ? (
          <span className="badge verified">✓ Verified</span>
        ) : (
          <span className="badge pending">Verification pending</span>
        )}
        <div>
          <button
            className="book-btn"
            onClick={(e) => {
              e.stopPropagation()
              setShowForm(true)
            }}
          >
            Book Now
          </button>
        </div>
      </div>

      {showDetail && (
        <HelperDetail
          helper={helper}
          onClose={() => setShowDetail(false)}
          onBook={() => {
            setShowDetail(false)
            setShowForm(true)
          }}
        />
      )}

      {showForm && (
        <BookingForm helper={helper} onClose={() => setShowForm(false)} />
      )}
    </>
  )
}

export default HelperCard