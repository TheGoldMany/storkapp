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
import { foundPetAPI } from '../services/api'
import ImageUpload from '../components/ImageUpload'

const ReportFoundPetPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: 'DOG',
    breed: '',
    color: '',
    age: '',
    gender: 'MALE',
    description: '',
    images: [] as string[],
    foundLocation: '',
    foundCity: '',
    foundDate: new Date().toISOString().split('T')[0],
    currentLocation: '',
    finderName: '',
    finderPhone: '',
    finderEmail: '',
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
      }
      await foundPetAPI.createFoundPet(submitData)
      navigate('/found-pets')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hiba történt a bejelentés során')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/found-pets')}
        sx={{ mb: 3 }}
      >
        Vissza a talált állatokhoz
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Talált állat bejelentése
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Ha találtál egy állatot, töltsd ki az alábbi űrlapot, hogy segíthessünk visszajuttatni gazdájához.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Típus"
                name="type"
                value={formData.type}
                onChange={handleChange}
                SelectProps={{ native: true }}
                required
              >
                <option value="DOG">Kutya</option>
                <option value="CAT">Macska</option>
                <option value="BIRD">Madár</option>
                <option value="RABBIT">Nyúl</option>
                <option value="OTHER">Egyéb</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fajta (ha ismert)"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Pl. labrador retriever"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Szín"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
                placeholder="Pl. barna és fehér"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Nem"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                SelectProps={{ native: true }}
                required
              >
                <option value="MALE">Hím</option>
                <option value="FEMALE">Nőstény</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Becsült kor (év)"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Pl. 2"
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
                required
                placeholder="Különleges jegyek, viselkedés, állapot, stb."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Fényképek a talált állatról
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
                label="Város"
                name="foundCity"
                value={formData.foundCity}
                onChange={handleChange}
                required
                placeholder="Pl. Budapest"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hol találtad?"
                name="foundLocation"
                value={formData.foundLocation}
                onChange={handleChange}
                required
                placeholder="Pontos cím vagy környék"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Mikor találtad?"
                name="foundDate"
                value={formData.foundDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ideiglenes tartózkodási hely"
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                placeholder="Hol van jelenleg az állat?"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Megtaláló neve"
                name="finderName"
                value={formData.finderName}
                onChange={handleChange}
                required
                placeholder="Teljes név"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kapcsolattartói telefon"
                name="finderPhone"
                value={formData.finderPhone}
                onChange={handleChange}
                required
                placeholder="+36 20 123 4567"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Kapcsolattartói email"
                name="finderEmail"
                value={formData.finderEmail}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/found-pets')}
                  disabled={loading}
                >
                  Mégse
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Mentés...' : 'Bejelentés elküldése'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default ReportFoundPetPage
