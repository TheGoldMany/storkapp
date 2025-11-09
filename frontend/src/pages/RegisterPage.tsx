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
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { registerUser, clearError } from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'

const RegisterPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)

  const [accountType, setAccountType] = useState<'USER' | 'SHELTER_ADMIN'>('USER')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Shelter fields
    shelterName: '',
    shelterAddress: '',
    shelterCity: '',
    shelterDescription: '',
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
      errors.firstName = t('auth.validation.firstNameRequired')
    }

    if (!formData.lastName.trim()) {
      errors.lastName = t('auth.validation.lastNameRequired')
    }

    if (!formData.email.trim()) {
      errors.email = t('auth.validation.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('auth.validation.emailInvalid')
    }

    if (!formData.password) {
      errors.password = t('auth.validation.passwordRequired')
    } else if (formData.password.length < 6) {
      errors.password = t('auth.validation.passwordMinLength')
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth.validation.passwordMismatch')
    }

    // Shelter-specific validation
    if (accountType === 'SHELTER_ADMIN') {
      if (!formData.shelterName.trim()) {
        errors.shelterName = t('auth.validation.shelterNameRequired')
      }
      if (!formData.shelterAddress.trim()) {
        errors.shelterAddress = t('auth.validation.shelterAddressRequired')
      }
      if (!formData.shelterCity.trim()) {
        errors.shelterCity = t('auth.validation.shelterCityRequired')
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const { confirmPassword, shelterName, shelterAddress, shelterCity, shelterDescription, ...baseData } = formData

    const registerData: any = {
      ...baseData,
      role: accountType,
    }

    // Add shelter data if registering as shelter admin
    if (accountType === 'SHELTER_ADMIN') {
      registerData.shelter = {
        name: shelterName,
        address: shelterAddress,
        city: shelterCity,
        description: shelterDescription || null,
        email: formData.email,
        phone: formData.phone || '',
        country: 'Hungary',
      }
    }

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
              {t('auth.register')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('auth.createAccount')}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Account Type Selection */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <ToggleButtonGroup
                value={accountType}
                exclusive
                onChange={(_, newType) => newType && setAccountType(newType)}
                color="primary"
                fullWidth
                sx={{ maxWidth: 400 }}
              >
                <ToggleButton value="USER">
                  <PersonIcon sx={{ mr: 1 }} />
                  {t('auth.individual')}
                </ToggleButton>
                <ToggleButton value="SHELTER_ADMIN">
                  <BusinessIcon sx={{ mr: 1 }} />
                  {t('auth.shelter')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label={t('auth.firstName')}
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
                  label={t('auth.lastName')}
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
              label={t('auth.email')}
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
              label={t('auth.phoneOptional')}
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />

            {/* Shelter-specific fields */}
            {accountType === 'SHELTER_ADMIN' && (
              <>
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.shelterData')}
                  </Typography>
                </Divider>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="shelterName"
                  label={t('auth.shelterName')}
                  name="shelterName"
                  value={formData.shelterName}
                  onChange={handleChange}
                  disabled={loading}
                  error={!!validationErrors.shelterName}
                  helperText={validationErrors.shelterName}
                />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="shelterCity"
                      label={t('auth.shelterCity')}
                      name="shelterCity"
                      value={formData.shelterCity}
                      onChange={handleChange}
                      disabled={loading}
                      error={!!validationErrors.shelterCity}
                      helperText={validationErrors.shelterCity}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="shelterAddress"
                      label={t('auth.shelterAddress')}
                      name="shelterAddress"
                      value={formData.shelterAddress}
                      onChange={handleChange}
                      disabled={loading}
                      error={!!validationErrors.shelterAddress}
                      helperText={validationErrors.shelterAddress}
                    />
                  </Grid>
                </Grid>

                <TextField
                  margin="normal"
                  fullWidth
                  multiline
                  rows={3}
                  id="shelterDescription"
                  label={t('auth.shelterDescription')}
                  name="shelterDescription"
                  value={formData.shelterDescription}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder={t('auth.shelterDescriptionPlaceholder')}
                />

                <Divider sx={{ my: 3 }} />
              </>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.password')}
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
              label={t('auth.confirmPassword')}
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
              {loading ? t('auth.registering') : t('auth.register')}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                {t('auth.hasAccount')}{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  {t('auth.loginHere')}
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
