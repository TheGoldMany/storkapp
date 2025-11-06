import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  Grid,
  MenuItem,
} from '@mui/material'
import { Home as HomeIcon } from '@mui/icons-material'
import { shelterAPI } from '../services/api'
import { fetchUserProfile } from '../store/slices/authSlice'
import { AppDispatch } from '../store/store'

const ShelterRegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    website: '',
    bankAccount: '',
    taxNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await shelterAPI.createShelter(formData)
      setSuccess(true)

      // Refresh user profile to get updated role
      await dispatch(fetchUserProfile())

      // Redirect to shelter dashboard
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a menhely regisztrálása során')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <HomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Menhely Regisztráció
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regisztráld a menhelyedet és kezdd el kezelni az állataid adatait
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Menhely sikeresen létrehozva! Átirányítás...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Menhely neve"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Leírás"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading || success}
                  helperText="Írd le röviden a menhelyedet"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Telefonszám"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Cím"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Város"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Irányítószám"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Weboldal (opcionális)"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bankszámlaszám (opcionális)"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  disabled={loading || success}
                  helperText="Adományokhoz"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Adószám (opcionális)"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleChange}
                  disabled={loading || success}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading || success}
            >
              {loading ? 'Regisztráció...' : 'Menhely létrehozása'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default ShelterRegisterPage
