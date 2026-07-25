import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in as admin
    const checkAdmin = () => {
      const user = localStorage.getItem('adminUser')
      if (user) {
        setIsAdmin(true)
        setAdminUser(JSON.parse(user))
      }
    }
    checkAdmin()
  }, [])

  const handleAdminLogout = () => {
    setIsAdmin(false)
    setAdminUser(null)
    localStorage.removeItem('adminUser')
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-grow">
          <Routes>
            {/* Homepage */}
            <Route 
              path="/" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Wise Warrior Safaris</h1>
                    <p className="text-xl text-gray-600 mb-8">Professional East African Safari Booking Platform</p>
                    <div className="space-x-4">
                      <a href="/packages" className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                        View Packages
                      </a>
                      <a href="/admin" className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900">
                        Admin Panel
                      </a>
                    </div>
                  </div>
                </div>
              } 
            />

            {/* Packages Page */}
            <Route 
              path="/packages" 
              element={
                <div className="min-h-screen bg-white py-12">
                  <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-12">Our Safari Packages</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="border rounded-lg overflow-hidden shadow-lg">
                        <div className="bg-orange-600 h-48"></div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">Safari Package</h3>
                          <p className="text-gray-600 mb-4">Explore the beauty of African wildlife</p>
                          <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />

            {/* Admin Page */}
            <Route 
              path="/admin" 
              element={
                <div className="min-h-screen bg-gray-100 py-12">
                  <div className="max-w-2xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
                    <div className="bg-white p-8 rounded-lg shadow">
                      <h2 className="text-2xl font-bold mb-6">Welcome to Admin Panel</h2>
                      <p className="text-gray-600 mb-4">Manage your safari packages and bookings</p>
                      <button 
                        onClick={handleAdminLogout}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
