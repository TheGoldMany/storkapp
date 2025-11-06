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

const ReportLostPetPage = () => {
  const navigate = useNavigate()
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
    lastSeenLocation: '',
    lastSeenDate: new Date().toISOString().split('T')[0],
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
      setError(err.response?.data?.message || 'Hiba történt a bejelentés során')
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
        Vissza az elveszett állatokhoz
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Elveszett állat bejelentése
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Töltsd ki az alábbi qrlapot, hogy segíthessünk megtalálni elveszett kedvencedet.
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
                label="Állat neve"
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
                label="Fajta"
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
                <option value="FEMALE">NQstény</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Kor (év)"
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
                label="Leírás"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Különleges jegyek, viselkedés, stb."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Utoljára látott helyszín"
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
                label="Utoljára látva dátuma"
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
                label="Kapcsolattartói telefon"
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
                label="Kapcsolattartói email"
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
                label="Jutalom (opcionális, Ft-ban)"
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

export default ReportLostPetPage
