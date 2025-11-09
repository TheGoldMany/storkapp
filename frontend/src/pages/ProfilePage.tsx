import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material'
import { RootState, AppDispatch } from '../store/store'
import { authAPI } from '../services/api'
import { fetchUserProfile } from '../store/slices/authSlice'
import ImageUpload from '../components/ImageUpload'

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: [] as string[],
    // Shelter fields
    shelterName: '',
    shelterAddress: '',
    shelterCity: '',
    shelterDescription: '',
    shelterLogo: [] as string[],
    shelterWebsite: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar ? [user.avatar] : [],
        // Shelter fields
        shelterName: user.shelter?.name || '',
        shelterAddress: user.shelter?.address || '',
        shelterCity: user.shelter?.city || '',
        shelterDescription: user.shelter?.description || '',
        shelterLogo: user.shelter?.logo ? [user.shelter.logo] : [],
        shelterWebsite: user.shelter?.website || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const profileData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatar: formData.avatar[0] || null,
      }

      // Add shelter data if user is shelter admin
      if (user?.role === 'SHELTER_ADMIN' && user.shelter) {
        profileData.shelter = {
          name: formData.shelterName,
          address: formData.shelterAddress,
          city: formData.shelterCity,
          description: formData.shelterDescription,
          logo: formData.shelterLogo[0] || null,
          website: formData.shelterWebsite || null,
        }
      }

      await authAPI.updateProfile(profileData)

      // Refresh user profile
      await dispatch(fetchUserProfile())
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a profil frissítése során')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profilom
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
            Profil sikeresen frissítve!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Profile Image */}
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {formData.avatar.length > 0 ? (
                <Avatar
                  src={`http://localhost:3000${formData.avatar[0]}`}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              ) : (
                <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
                  {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                </Avatar>
              )}
              <Typography variant="subtitle2" gutterBottom>
                Profilkép
              </Typography>
              <ImageUpload
                value={formData.avatar}
                onChange={(images) => setFormData({ ...formData, avatar: images })}
                multiple={false}
                maxImages={1}
              />
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Személyes adatok
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Keresztnév"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Vezetéknév"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled
                label="Email"
                name="email"
                value={formData.email}
                helperText="Az email cím nem módosítható"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefonszám"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+36 20 123 4567"
              />
            </Grid>

            {/* Shelter Information - Only for Shelter Admins */}
            {user?.role === 'SHELTER_ADMIN' && user.shelter && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Menhely adatok
                  </Typography>
                </Grid>

                {/* Shelter Logo */}
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {formData.shelterLogo.length > 0 ? (
                    <Avatar
                      src={`http://localhost:3000${formData.shelterLogo[0]}`}
                      sx={{ width: 120, height: 120, mb: 2 }}
                      variant="rounded"
                    />
                  ) : (
                    <Avatar sx={{ width: 120, height: 120, mb: 2 }} variant="rounded">
                      {formData.shelterName.charAt(0)}
                    </Avatar>
                  )}
                  <Typography variant="subtitle2" gutterBottom>
                    Menhely logó
                  </Typography>
                  <ImageUpload
                    value={formData.shelterLogo}
                    onChange={(images) => setFormData({ ...formData, shelterLogo: images })}
                    multiple={false}
                    maxImages={1}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Menhely neve"
                    name="shelterName"
                    value={formData.shelterName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Város"
                    name="shelterCity"
                    value={formData.shelterCity}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Cím"
                    name="shelterAddress"
                    value={formData.shelterAddress}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Website"
                    name="shelterWebsite"
                    value={formData.shelterWebsite}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Leírás"
                    name="shelterDescription"
                    value={formData.shelterDescription}
                    onChange={handleChange}
                    placeholder="Írj néhány mondatot a menhelyről..."
                  />
                </Grid>
              </>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Mentés...' : 'Profil frissítése'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default ProfilePage
