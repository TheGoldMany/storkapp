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
import VerifyEmailPage from './pages/VerifyEmailPage'
import ShelterRegisterPage from './pages/ShelterRegisterPage'
import SheltersPage from './pages/SheltersPage'
import ShelterDetailPage from './pages/ShelterDetailPage'
import AnimalsPage from './pages/AnimalsPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import LostPetsPage from './pages/LostPetsPage'
import LostPetDetailPage from './pages/LostPetDetailPage'
import ReportLostPetPage from './pages/ReportLostPetPage'
import FoundPetsPage from './pages/FoundPetsPage'
import FoundPetDetailPage from './pages/FoundPetDetailPage'
import ReportFoundPetPage from './pages/ReportFoundPetPage'
import TipsPage from './pages/TipsPage'
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
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route path="/shelters" element={<SheltersPage />} />
          <Route path="/shelters/:id" element={<ShelterDetailPage />} />

          <Route path="/animals" element={<AnimalsPage />} />
          <Route path="/animals/:id" element={<AnimalDetailPage />} />

          <Route path="/lost-pets" element={<LostPetsPage />} />
          <Route path="/lost-pets/:id" element={<LostPetDetailPage />} />
          <Route path="/found-pets" element={<FoundPetsPage />} />
          <Route path="/found-pets/:id" element={<FoundPetDetailPage />} />

          <Route path="/tips" element={<TipsPage />} />
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
            path="/lost-pets/report"
            element={
              <ProtectedRoute>
                <ReportLostPetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/found-pets/report"
            element={
              <ProtectedRoute>
                <ReportFoundPetPage />
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
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App
