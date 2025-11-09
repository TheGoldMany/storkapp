import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { lostPetAPI } from '../services/api'
import ImageUpload from '../components/ImageUpload'
import { useTranslation } from 'react-i18next'

const ReportLostPetPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'DOG',
    breed: '',
    color: '',
    age: '',
    gender: 'MALE',
    description: '',
    images: [] as string[],
    lastSeenLocation: '',
    lastSeenCity: '',
    lastSeenDate: new Date().toISOString().split('T')[0],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    reward: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        reward: formData.reward ? parseFloat(formData.reward) : undefined,
      }
      await lostPetAPI.createLostPet(submitData)
      navigate('/lost-pets')
    } catch (err: any) {
      setError(err.response?.data?.message || t('lostPets.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/lost-pets')}
        sx={{ mb: 3 }}
      >
        {t('lostPets.back')}
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('lostPets.formTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {t('lostPets.formSubtitle')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('lostPets.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Pl. Bodri"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label={t('lostPets.type')}
                name="type"
                value={formData.type}
                onChange={handleChange}
                SelectProps={{ native: true }}
                required
              >
                <option value="DOG">{t('animals.types.DOG')}</option>
                <option value="CAT">{t('animals.types.CAT')}</option>
                <option value="BIRD">{t('animals.types.BIRD')}</option>
                <option value="RABBIT">{t('animals.types.RABBIT')}</option>
                <option value="OTHER">{t('animals.types.OTHER')}</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('lostPets.breed')}
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Pl. labrador retriever"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('lostPets.color')}
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Pl. barna és fehér"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label={t('lostPets.gender')}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                SelectProps={{ native: true }}
                required
              >
                <option value="MALE">{t('animals.genders.MALE')}</option>
                <option value="FEMALE">{t('animals.genders.FEMALE')}</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={t('lostPets.age')}
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Pl. 3"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t('lostPets.description')}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Különleges jegyek, viselkedés, stb."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {t('lostPets.images')}
              </Typography>
              <ImageUpload
                value={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
                multiple
                maxImages={5}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('lostPets.city')}
                name="lastSeenCity"
                value={formData.lastSeenCity}
                onChange={handleChange}
                required
                placeholder="Pl. Budapest"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('lostPets.lastSeenLocation')}
                name="lastSeenLocation"
                value={formData.lastSeenLocation}
                onChange={handleChange}
                required
                placeholder="Pontos cím vagy környék"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label={t('lostPets.lastSeenDate')}
                name="lastSeenDate"
                value={formData.lastSeenDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('lostPets.contactName')}
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                placeholder="Teljes név"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('lostPets.contactPhone')}
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                placeholder="+36 20 123 4567"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label={t('lostPets.contactEmail')}
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                placeholder="email@example.com"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label={t('lostPets.reward')}
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                placeholder="Pl. 50000"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/lost-pets')}
                  disabled={loading}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                >
                  {loading ? `${t('common.save')}...` : t('lostPets.submit')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default ReportLostPetPage
