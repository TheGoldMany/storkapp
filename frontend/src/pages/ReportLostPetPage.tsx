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
    images: [] as string[],
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
      setError(err.response?.data?.message || 'Hiba t�rt�nt a bejelent�s sor�n')
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
        Vissza az elveszett �llatokhoz
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Elveszett �llat bejelent�se
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          T�ltsd ki az al�bbi qrlapot, hogy seg�thess�nk megtal�lni elveszett kedvencedet.
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
                label="�llat neve"
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
                label="T�pus"
                name="type"
                value={formData.type}
                onChange={handleChange}
                SelectProps={{ native: true }}
                required
              >
                <option value="DOG">Kutya</option>
                <option value="CAT">Macska</option>
                <option value="BIRD">Mad�r</option>
                <option value="RABBIT">Ny�l</option>
                <option value="OTHER">Egy�b</option>
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
                label="Sz�n"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Pl. barna �s feh�r"
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
                <option value="MALE">H�m</option>
                <option value="FEMALE">NQst�ny</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Kor (�v)"
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

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Fényképek az állatról
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
                label="Utolj�ra l�tott helysz�n"
                name="lastSeenLocation"
                value={formData.lastSeenLocation}
                onChange={handleChange}
                required
                placeholder="Pontos c�m vagy k�rny�k"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Utolj�ra l�tva d�tuma"
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
                label="Kapcsolattart�i telefon"
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
                label="Kapcsolattart�i email"
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
                label="Jutalom (opcion�lis, Ft-ban)"
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
                  M�gse
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Ment�s...' : 'Bejelent�s elk�ld�se'}
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
