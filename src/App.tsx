import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PackagesPage from './pages/PackagesPage'
import BookingPage from './pages/BookingPage'
import AdminDashboard from './components/AdminDashboard'
import { AppContext } from './context/AppContext'

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
    <AppContext.Provider value={{ isAdmin, adminUser }}>
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          {!isAdmin && <Header />}
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/booking/:packageId" element={<BookingPage />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminDashboard 
                    isAdmin={isAdmin}
                    setIsAdmin={setIsAdmin}
                    onLogout={handleAdminLogout}
                  />
                } 
              />
            </Routes>
          </main>

          {!isAdmin && <Footer />}
        </div>
      </Router>
    </AppContext.Provider>
  )
}

export default App
