import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function formatDate(d) {
  if (!d) return '-'
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function todayIST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}

function Avatar({ name, url }) {
  if (url) {
    return <img src={url} alt={name} className="dash-photo" />
  }
  return (
    <div className="dash-photo dash-photo-fallback">
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  )
}

function StatusBadge({ status }) {
  const s = status ?? 'Pending'
  const cls = s === 'Accepted' ? 'verified' : s === 'Declined' ? 'declined' : 'pending'
  return <span className={`badge ${cls}`}>{s}</span>
}

function RatingLine({ helper }) {
  if (helper.rating == null) {
    return <p className="no-rating">No ratings yet</p>
  }
  const n = helper.review_count ?? 0
  return (
    <p className="rating">
      ⭐ {helper.rating}
      {n > 0 && (
        <span className="review-count"> ({n} {n === 1 ? 'review' : 'reviews'})</span>
      )}
    </p>
  )
}

function RatingForm({ booking, user, fullName, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (rating < 1) {
      setError('Please choose a star rating.')
      return
    }

    setSubmitting(true)
    setError('')

    const { data, error: insertError } = await supabase
      .from('reviews')
      .insert({
        helper_id: booking.helper_id,
        booking_id: booking.id,
        user_id: user.id,
        author: fullName || 'Customer',
        rating,
        comment: comment.trim() || null,
      })
      .select()
      .single()

    setSubmitting(false)

    if (insertError) {
      console.error('Review failed:', insertError)
      setError('Could not submit your review. Please try again.')
      return
    }

    onSubmitted(booking, data)
  }

  return (
    <form className="rate-box" onSubmit={handleSubmit}>
      <h5>Rate this helper</h5>

      <div className="star-row">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star-btn ${n <= rating ? 'active' : ''}`}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
      />

      {error && <p className="dash-error">{error}</p>}

      <button type="submit" className="book-btn" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
    </form>
  )
}

function MyBookings({ onNavigate, user }) {
  const [userType, setUserType] = useState(null)
  const [fullName, setFullName] = useState('')
  const [myListings, setMyListings] = useState([])
  const [incoming, setIncoming] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [helpersById, setHelpersById] = useState({})
  const [reviewsByBooking, setReviewsByBooking] = useState({})
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [actionError, setActionError] = useState('')

  const userId = user?.id

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, user_type')
        .eq('id', userId)
        .maybeSingle()

      const type = profile?.user_type ?? 'customer'
      setUserType(type)
      setFullName(profile?.full_name ?? '')

      if (type === 'helper') {
        const { data: listings } = await supabase
          .from('helpers')
          .select('*')
          .eq('user_id', userId)

        const mine = listings ?? []
        setMyListings(mine)

        const ids = mine.map((l) => l.id)
        if (ids.length > 0) {
          const { data } = await supabase
            .from('bookings')
            .select('*')
            .in('helper_id', ids)
            .order('created_at', { ascending: false })
          setIncoming(data ?? [])
        } else {
          setIncoming([])
        }
      }

      // Bookings this person made as a customer (helpers can book too)
      const { data: mineBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      const rows = mineBookings ?? []
      setMyBookings(rows)

      const helperIds = [...new Set(rows.map((b) => b.helper_id).filter(Boolean))]
      if (helperIds.length > 0) {
        const { data: hs } = await supabase
          .from('helpers')
          .select('*')
          .in('id', helperIds)
        const map = {}
        ;(hs ?? []).forEach((h) => {
          map[h.id] = h
        })
        setHelpersById(map)
      }

      const bookingIds = rows.map((b) => b.id)
      if (bookingIds.length > 0) {
        const { data: rv } = await supabase
          .from('reviews')
          .select('*')
          .in('booking_id', bookingIds)
        const rmap = {}
        ;(rv ?? []).forEach((r) => {
          rmap[r.booking_id] = r
        })
        setReviewsByBooking(rmap)
      }

      setLoading(false)
    }

    load()
  }, [userId])

  async function updateStatus(bookingId, newStatus) {
    setUpdatingId(bookingId)
    setActionError('')

    const { data, error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)
      .select()

    setUpdatingId(null)

    if (error || !data || data.length === 0) {
      console.error('Status update failed:', error)
      setActionError('Could not update this booking. Please try again.')
      return
    }

    setIncoming((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    )
  }

  async function handleReviewed(booking, review) {
    setReviewsByBooking((prev) => ({ ...prev, [booking.id]: review }))

    const { data } = await supabase
      .from('helpers')
      .select('rating, review_count')
      .eq('id', booking.helper_id)
      .maybeSingle()

    if (data) {
      setHelpersById((prev) => ({
        ...prev,
        [booking.helper_id]: {
          ...prev[booking.helper_id],
          rating: data.rating,
          review_count: data.review_count,
        },
      }))
    }
  }

  function renderMyBooking(b) {
    const h = helpersById[b.helper_id]
    const status = b.status ?? 'Pending'
    const review = reviewsByBooking[b.id]
    const started = !!b.start_date && b.start_date <= todayIST()

    return (
      <div key={b.id} className="dash-card">
        <Avatar name={h?.name} url={h?.photo_url} />
        <div className="dash-card-body">
          <h4>{h ? h.name : 'Helper no longer available'}</h4>
          {h && <p>{h.role} · {h.experience}</p>}
          {h && <p>{h.location}</p>}
          {h && <RatingLine helper={h} />}
          {h?.salary && <p>₹{h.salary}/month</p>}
          {h && (h.verified ? (
            <span className="badge verified">✓ Verified</span>
          ) : (
            <span className="badge pending">Verification pending</span>
          ))}
          <p><strong>Booked for:</strong> {formatDate(b.start_date)}</p>
          {b.notes && <p><strong>Your note:</strong> {b.notes}</p>}
          <StatusBadge status={status} />
          {status === 'Accepted' && (
            <p>The helper accepted your request and can contact you on the number you provided.</p>
          )}
          {status === 'Declined' && (
            <p>The helper declined this request. You can browse other helpers.</p>
          )}

          {status === 'Accepted' && (
            review ? (
              <div className="your-review">
                <p className="rating">Your review: ⭐ {review.rating}/5</p>
                {review.comment && <p>{review.comment}</p>}
              </div>
            ) : started ? (
              <RatingForm
                booking={b}
                user={user}
                fullName={fullName}
                onSubmitted={handleReviewed}
              />
            ) : (
              <p className="rate-wait">
                You can rate this helper once the booking date ({formatDate(b.start_date)}) arrives.
              </p>
            )
          )}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <main>
        <div className="gate-card">
          <div className="gate-icon">🔒</div>
          <h2>Sign in to view your Dashboard</h2>
          <p>
            Track your bookings, manage requests, and stay updated —
            all in one place once you're signed in.
          </p>
          <button
            className="primary-btn gate-btn"
            onClick={() => onNavigate('login')}
          >
            Sign In
          </button>
          <p className="auth-footer">
            Don't have an account?{' '}
            <span className="link-text" onClick={() => onNavigate('signup')}>
              Sign Up
            </span>
          </p>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main>
        <p className="no-results">Loading your dashboard...</p>
      </main>
    )
  }

    return (
    <main>
      <h2>Welcome{fullName ? `, ${fullName}` : ''}</h2>
      <p className="dashboard-sub">
        {userType === 'helper' ? 'Helper account' : 'Customer account'}
      </p>

      {userType === 'helper' ? (
        <>
          <h3>Your listing</h3>
          {myListings.length === 0 ? (
            <div className="dashboard-empty">
              <p>You haven't listed your services yet.</p>
              <button className="primary-btn" onClick={() => onNavigate('services')}>
                List Your Services
              </button>
            </div>
          ) : (
            myListings.map((l) => (
              <div key={l.id} className="dash-card">
                <Avatar name={l.name} url={l.photo_url} />
                <div className="dash-card-body">
                  <h4>{l.name}</h4>
                  <p>{l.role} · {l.experience}</p>
                  <p>{l.location}</p>
                  <RatingLine helper={l} />
                  {l.salary && <p>₹{l.salary}/month</p>}
                  {l.verified ? (
                    <span className="badge verified">✓ Verified</span>
                  ) : (
                    <span className="badge pending">Verification pending</span>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="dash-columns">
            <section className="dash-col">
              <h3>Booking requests</h3>
              {actionError && <p className="dash-error">{actionError}</p>}
              {incoming.length === 0 ? (
                <p className="dashboard-sub">No booking requests yet.</p>
              ) : (
                incoming.map((b) => (
                  <div key={b.id} className="dash-card">
                    <div className="dash-card-body">
                      <h4>{b.customer_name}</h4>
                      <p>Phone: {b.customer_phone}</p>
                      <p><strong>Start date:</strong> {formatDate(b.start_date)}</p>
                      {b.notes && <p><strong>Note:</strong> {b.notes}</p>}
                      <StatusBadge status={b.status} />
                      {(b.status ?? 'Pending') === 'Pending' && (
                        <div className="dash-actions">
                          <button
                            className="accept-btn"
                            disabled={updatingId === b.id}
                            onClick={() => updateStatus(b.id, 'Accepted')}
                          >
                            Accept
                          </button>
                          <button
                            className="decline-btn"
                            disabled={updatingId === b.id}
                            onClick={() => updateStatus(b.id, 'Declined')}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </section>

            <section className="dash-col">
              <h3>Your bookings</h3>
              {myBookings.length === 0 ? (
                <div className="dashboard-empty">
                  <p>You haven't booked anyone yet.</p>
                  <button className="primary-btn" onClick={() => onNavigate('browse')}>
                    Browse Helpers
                  </button>
                </div>
              ) : (
                myBookings.map(renderMyBooking)
              )}
            </section>
          </div>
        </>
      ) : (
        <>
          <h3>Your bookings</h3>
          {myBookings.length === 0 ? (
            <div className="dashboard-empty">
              <p>You haven't booked anyone yet.</p>
              <button className="primary-btn" onClick={() => onNavigate('browse')}>
                Browse Helpers
              </button>
            </div>
          ) : (
            myBookings.map(renderMyBooking)
          )}
        </>
      )}
    </main>
  )
}

export default MyBookings