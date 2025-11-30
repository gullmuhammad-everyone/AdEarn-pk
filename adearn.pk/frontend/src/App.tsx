import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useStore } from './store/useStore'
import { socket } from './lib/socket'

// Components
import Header from './components/common/Header'
import Footer from './components/common/Footer'

// Pages
import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Ads from './pages/Dashboard/Ads'
import Withdraw from './pages/Dashboard/Withdraw'
import Referral from './pages/Dashboard/Referral'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Users from './pages/Admin/Users'
import Payments from './pages/Admin/Payments'
import AdsManagement from './pages/Admin/AdsManagement'

function App() {
  const { user, updateStats, theme } = useStore()

  useEffect(() => {
    // Initialize socket connection when user is authenticated
    if (user) {
      socket.connect()

      // Listen for real-time updates
      socket.on('statsUpdate', (stats) => {
        updateStats(stats)
      })

      socket.on('adCompleted', (data) => {
        import('./lib/utils').then(({ generateConfetti }) => {
          generateConfetti()
        })
      })

      return () => {
        socket.off('statsUpdate')
        socket.off('adCompleted')
        socket.disconnect()
      }
    }
  }, [user, updateStats])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {user && <Header />}
        
        <main className={user ? 'min-h-[calc(100vh-140px)]' : 'min-h-screen'}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/dashboard/ads" element={user ? <Ads /> : <Navigate to="/login" />} />
            <Route path="/dashboard/withdraw" element={user ? <Withdraw /> : <Navigate to="/login" />} />
            <Route path="/dashboard/referral" element={user ? <Referral /> : <Navigate to="/login" />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/admin/users" element={user?.role === 'admin' ? <Users /> : <Navigate to="/" />} />
            <Route path="/admin/payments" element={user?.role === 'admin' ? <Payments /> : <Navigate to="/" />} />
            <Route path="/admin/ads" element={user?.role === 'admin' ? <AdsManagement /> : <Navigate to="/" />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {!user && <Footer />}
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'dark:bg-gray-800 dark:text-white border dark:border-gray-700',
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default App