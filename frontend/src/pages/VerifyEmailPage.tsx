import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material'
import { authAPI } from '../services/api'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Hiányzó verifikációs token')
      setLoading(false)
      return
    }

    verifyEmail(token)
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    try {
      setLoading(true)
      await authAPI.verifyEmail(token)
      setSuccess(true)
      setError(null)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email verifikáció sikertelen')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            {loading && (
              <>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Email cím ellenőrzése...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kérjük várj, amíg ellenőrizzük az email címed.
                </Typography>
              </>
            )}

            {success && (
              <>
                <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom color="success.main">
                  Email cím sikeresen ellenőrizve!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Az email címed megerősítésre került. Most már bejelentkezhetsz a fiókodba.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Átirányítás a bejelentkezéshez...
                </Typography>
              </>
            )}

            {error && !loading && (
              <>
                <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom color="error">
                  Verifikáció sikertelen
                </Typography>
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
                <Typography variant="body2" color="text.secondary" paragraph>
                  A verifikációs link lehet hogy lejárt vagy érvénytelen.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{ mr: 1 }}
                  >
                    Bejelentkezés
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/register')}
                  >
                    Új regisztráció
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default VerifyEmailPage
