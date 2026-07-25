import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PackagesPage from './pages/PackagesPage'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = () => {
      const user = localStorage.getItem('adminUser')
      if (user) {
        setIsAdmin(true)
      }
    }
    checkAdmin()
  }, [])

  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('adminUser')
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        {!isAdmin && <Header />}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/packages" element={<PackagesPage />} />
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
  )
}

export default App
