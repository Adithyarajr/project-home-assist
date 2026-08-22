import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function HelperDetail({ helper, onClose, onBook }) {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('helper_id', helper.id)

      if (error) {
        console.error('Supabase error:', error)
      } else {
        setReviews(data)
      }
    }
    fetchReviews()
  }, [helper.id])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="detail-main">
          <img src={helper.photo_url} alt={helper.name} className="detail-photo" />
          <div>
            <h2>{helper.name}</h2>
            <p>{helper.role} · {helper.experience}</p>
            <p>{helper.location}</p>
            <p className="rating">⭐ {helper.rating}</p>
            <p>{helper.phone}</p>
            <p className="salary">₹{helper.salary}/month</p>
            {helper.verified ? (
              <span className="badge verified">✓ Verified</span>
            ) : (
              <span className="badge pending">Verification pending</span>
            )}
            <div>
              <button className="book-btn" onClick={onBook}>
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div className="detail-reviews">
          <h3>Customer Reviews</h3>
          {reviews.map((review) => (
            <div key={review.id} className="review">
              <div className="review-avatar">
                {review.author.charAt(0).toUpperCase()}
              </div>
              <div className="review-body">
                <div className="review-header">
                  <p className="review-author">{review.author}</p>
                  <span className="review-rating">⭐ {review.rating}/5</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HelperDetail