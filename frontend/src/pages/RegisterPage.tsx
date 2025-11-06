import { useState, useEffect } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material'
import { Visibility, VisibilityOff, PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { registerUser, clearError } from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear validation error for this field
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      errors.firstName = 'Keresztnév megadása kötelező'
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Vezetéknév megadása kötelező'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email megadása kötelező'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Érvénytelen email formátum'
    }

    if (!formData.password) {
      errors.password = 'Jelszó megadása kötelező'
    } else if (formData.password.length < 6) {
      errors.password = 'A jelszónak legalább 6 karakter hosszúnak kell lennie'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'A jelszavak nem egyeznek'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const { confirmPassword, ...registerData } = formData
    await dispatch(registerUser(registerData))
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Regisztráció
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hozd létre a Stork App fiókodat
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="Keresztnév"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Vezetéknév"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email cím"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />

            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="Telefonszám (opcionális)"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Jelszó"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Jelszó megerősítése"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Regisztráció...' : 'Regisztráció'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Már van fiókod?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  Jelentkezz be itt
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default RegisterPage
