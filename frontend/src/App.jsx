import Home from './Home'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

import Navbar from './Navbar'
import HelperCard from './HelperCard'
import MyBookings from './MyBookings'

import Login from './Login'
import Signup from './Signup'
import BecomeHelper from './BecomeHelper'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [helpers, setHelpers] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchHelpers() {
      const { data, error } = await supabase.from('helpers').select('*')
      if (error) {
        console.error('Supabase error:', error)
      } else {
        setHelpers(data)
      }
      setLoading(false)
    }
    fetchHelpers()
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const filteredHelpers = helpers.filter((helper) => {
    const term = searchTerm.toLowerCase()

    return (
      helper.name.toLowerCase().includes(term) ||
      helper.location.toLowerCase().includes(term) ||
      helper.role.toLowerCase().includes(term)
    )
  })

  return (
    <>
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
      />

      <div className="app">
        {/* Home Page */}
        {currentPage === 'home' && (
          <Home onNavigate={setCurrentPage} helpers={helpers} />
        )}

        {/* Browse Helpers Page */}
        {currentPage === 'browse' && (
          <>
            <header className="header">
              <p className="tagline">
                Find trusted, verified and permanent help for your home
              </p>
            </header>

            <main>
              <h2>Browse Helpers</h2>

              <input
                type="text"
                className="search-bar"
                placeholder="Search by name, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {loading ? (
                <p className="no-results">Loading helpers...</p>
              ) : filteredHelpers.length === 0 ? (
                <p className="no-results">
                  No helpers match your search.
                </p>
              ) : (
                <div className="helper-list">
                  {filteredHelpers.map((helper) => (
                    <HelperCard
                      key={helper.id}
                      helper={helper}
                    />
                  ))}
                </div>
              )}
            </main>
          </>
        )}

        {/* My Bookings */}
        {currentPage === 'bookings' && (
          <MyBookings onNavigate={setCurrentPage} />
        )}

        {/* Login */}
        {currentPage === 'login' && (
          <Login onNavigate={setCurrentPage} />
        )}

        {/* Sign Up */}
        {currentPage === 'signup' && (
          <Signup onNavigate={setCurrentPage} />
        )}

        {/* List Your Services */}
        {currentPage === 'services' && (
          <BecomeHelper />
        )}
      </div>
    </>
  )
}

export default App