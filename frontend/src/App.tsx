import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ShelterRegisterPage from './pages/ShelterRegisterPage'
import SheltersPage from './pages/SheltersPage'
import ShelterDetailPage from './pages/ShelterDetailPage'
import AnimalsPage from './pages/AnimalsPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import LostPetsPage from './pages/LostPetsPage'
import FoundPetsPage from './pages/FoundPetsPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import HealthInfoPage from './pages/HealthInfoPage'
import { fetchUserProfile } from './store/slices/authSlice'
import { AppDispatch, RootState } from './store/store'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const { token, user } = useSelector((state: RootState) => state.auth)

  // Auto-login if token exists
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile())
    }
  }, [token, user, dispatch])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, py: 3 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/shelters" element={<SheltersPage />} />
          <Route path="/shelters/:id" element={<ShelterDetailPage />} />

          <Route path="/animals" element={<AnimalsPage />} />
          <Route path="/animals/:id" element={<AnimalDetailPage />} />

          <Route path="/health-info" element={<HealthInfoPage />} />

          {/* Protected routes */}
          <Route
            path="/shelter/register"
            element={
              <ProtectedRoute>
                <ShelterRegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lost-pets"
            element={
              <ProtectedRoute>
                <LostPetsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/found-pets"
            element={
              <ProtectedRoute>
                <FoundPetsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App
