import Home from './Home'
import { useState } from 'react'
import './App.css'

import { helpers } from './mockData'

import Navbar from './Navbar'
import HelperCard from './HelperCard'
import MyBookings from './MyBookings'

import Login from './Login'
import Signup from './Signup'
import BecomeHelper from './BecomeHelper'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')

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
      />

      <div className="app">
        {/* Home Page */}
{currentPage === 'home' && (
  <Home onNavigate={setCurrentPage} />
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

              {filteredHelpers.length === 0 ? (
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
        {currentPage === 'bookings' && <MyBookings onNavigate={setCurrentPage} />}

        {/* Login */}
        {currentPage === 'login' && <Login onNavigate={setCurrentPage} />}

        {/* Sign Up */}
        {currentPage === 'signup' && <Signup onNavigate={setCurrentPage} />}
        {/* List Your Services */}
        {currentPage === 'services' && <BecomeHelper />}
      </div>
    </>
  )
}

export default App