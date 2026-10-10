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

function MyBookings({ onNavigate, user }) {
  const [userType, setUserType] = useState(null)
  const [fullName, setFullName] = useState('')
  const [bookings, setBookings] = useState([])
  const [helpersById, setHelpersById] = useState({})
  const [myListings, setMyListings] = useState([])
  const [loading, setLoading] = useState(true)

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
          setBookings(data ?? [])
        } else {
          setBookings([])
        }
      } else {
        const { data } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        const rows = data ?? []
        setBookings(rows)

        const ids = [...new Set(rows.map((b) => b.helper_id).filter(Boolean))]
        if (ids.length > 0) {
          const { data: hs } = await supabase
            .from('helpers')
            .select('*')
            .in('id', ids)
          const map = {}
          ;(hs ?? []).forEach((h) => {
            map[h.id] = h
          })
          setHelpersById(map)
        }
      }

      setLoading(false)
    }

    load()
  }, [userId])

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

          <h3>Booking requests</h3>
          {bookings.length === 0 ? (
            <p className="dashboard-sub">No booking requests yet.</p>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="dash-card">
                <div className="dash-card-body">
                  <h4>{b.customer_name}</h4>
                  <p>Phone: {b.customer_phone}</p>
                  <p><strong>Start date:</strong> {formatDate(b.start_date)}</p>
                  {b.notes && <p><strong>Note:</strong> {b.notes}</p>}
                  <p><strong>Status:</strong> {b.status ?? 'Pending'}</p>
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <>
          <h3>Your bookings</h3>
          {bookings.length === 0 ? (
            <div className="dashboard-empty">
              <p>You haven't booked anyone yet.</p>
              <button className="primary-btn" onClick={() => onNavigate('browse')}>
                Browse Helpers
              </button>
            </div>
          ) : (
            bookings.map((b) => {
              const h = helpersById[b.helper_id]
              return (
                <div key={b.id} className="dash-card">
                  <Avatar name={h?.name} url={h?.photo_url} />
                  <div className="dash-card-body">
                    <h4>{h ? h.name : 'Helper no longer available'}</h4>
                    {h && <p>{h.role} · {h.experience}</p>}
                    {h && <p>{h.location}</p>}
                    {h && (
                      <p className="rating">
                        {h.rating != null ? `⭐ ${h.rating}` : 'No ratings yet'}
                      </p>
                    )}
                    {h?.salary && <p>₹{h.salary}/month</p>}
                    {h && (h.verified ? (
                      <span className="badge verified">✓ Verified</span>
                    ) : (
                      <span className="badge pending">Verification pending</span>
                    ))}
                    <p><strong>Booked for:</strong> {formatDate(b.start_date)}</p>
                    {b.notes && <p><strong>Your note:</strong> {b.notes}</p>}
                    <p><strong>Status:</strong> {b.status ?? 'Pending'}</p>
                  </div>
                </div>
              )
            })
          )}
        </>
      )}
    </main>
  )
}

export default MyBookings