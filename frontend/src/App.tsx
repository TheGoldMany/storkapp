import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SheltersPage from './pages/SheltersPage'
import ShelterDetailPage from './pages/ShelterDetailPage'
import AnimalsPage from './pages/AnimalsPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import LostPetsPage from './pages/LostPetsPage'
import FoundPetsPage from './pages/FoundPetsPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import HealthInfoPage from './pages/HealthInfoPage'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/shelters" element={<SheltersPage />} />
          <Route path="/shelters/:id" element={<ShelterDetailPage />} />

          <Route path="/animals" element={<AnimalsPage />} />
          <Route path="/animals/:id" element={<AnimalDetailPage />} />

          <Route path="/lost-pets" element={<LostPetsPage />} />
          <Route path="/found-pets" element={<FoundPetsPage />} />

          <Route path="/health-info" element={<HealthInfoPage />} />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App
