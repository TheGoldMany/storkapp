import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PetsIcon from '@mui/icons-material/Pets'
import HomeIcon from '@mui/icons-material/Home'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { animalAPI, shelterAPI } from '../services/api'

const AnimalDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState<any>(null)
  const [shelter, setShelter] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchAnimalData()
    }
  }, [id])

  const fetchAnimalData = async () => {
    try {
      setLoading(true)
      const animalResponse = await animalAPI.getAnimalById(id!)
      const animalData = animalResponse.data.data
      setAnimal(animalData)

      if (animalData.shelterId) {
        const shelterResponse = await shelterAPI.getShelterById(animalData.shelterId)
        setShelter(shelterResponse.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch animal data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Betöltés...</Typography>
      </Container>
    )
  }

  if (!animal) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Az állat nem található</Typography>
        <Button onClick={() => navigate('/animals')} sx={{ mt: 2 }}>
          Vissza az állatokhoz
        </Button>
      </Container>
    )
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Örökbefogadható'
      case 'ADOPTED':
        return 'Örökbefogadva'
      case 'PENDING':
        return 'Folyamatban'
      default:
        return status
    }
  }

  const getStatusColor = (status: string): any => {
    switch (status) {
      case 'AVAILABLE':
        return 'success'
      case 'ADOPTED':
        return 'default'
      case 'PENDING':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/animals')}
        sx={{ mb: 3 }}
      >
        Vissza az állatokhoz
      </Button>

      <Grid container spacing={4}>
        {/* Animal Image/Icon Section */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.light',
              position: 'relative',
              backgroundImage: animal.images?.length > 0
                ? `url(http://localhost:3000${animal.images[0]})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {!animal.images?.length && (
              <PetsIcon sx={{ fontSize: 120, color: 'primary.main' }} />
            )}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Chip
                label={getStatusLabel(animal.status)}
                color={getStatusColor(animal.status)}
                size="medium"
              />
            </Box>
          </Paper>
          {animal.images?.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
              {animal.images.map((img: string, idx: number) => (
                <Paper
                  key={idx}
                  elevation={2}
                  sx={{
                    minWidth: 80,
                    height: 80,
                    backgroundImage: `url(http://localhost:3000${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Animal Details Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              {animal.name}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Chip label={animal.type} color="primary" sx={{ mr: 1 }} />
              <Chip label={animal.breed} variant="outlined" sx={{ mr: 1 }} />
              <Chip
                label={animal.gender === 'MALE' ? 'Hím' : 'Nőstény'}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Kor
                </Typography>
                <Typography variant="body1">
                  {animal.age} {animal.ageUnit}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Méret
                </Typography>
                <Typography variant="body1">{animal.size || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Szín
                </Typography>
                <Typography variant="body1">{animal.color || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Ivartalanítva
                </Typography>
                <Typography variant="body1">
                  {animal.neutered ? 'Igen' : 'Nem'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Oltva
                </Typography>
                <Typography variant="body1">
                  {animal.vaccinated ? 'Igen' : 'Nem'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Chipelt
                </Typography>
                <Typography variant="body1">
                  {animal.microchipped ? 'Igen' : 'Nem'}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {animal.description && (
              <>
                <Typography variant="h6" gutterBottom>
                  Leírás
                </Typography>
                <Typography variant="body1" paragraph>
                  {animal.description}
                </Typography>
              </>
            )}

            {animal.specialNeeds && (
              <>
                <Typography variant="h6" gutterBottom color="warning.main">
                  Különleges igények
                </Typography>
                <Typography variant="body1" paragraph>
                  {animal.specialNeeds}
                </Typography>
              </>
            )}

            {animal.status === 'AVAILABLE' && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FavoriteIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Örökbefogadási szándék jelzése
                </Button>
                <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                  Kapcsolatba lépünk veled a menhelyen keresztül
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Shelter Information */}
        {shelter && (
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5">Menhely információk</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">{shelter.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {shelter.address}, {shelter.city}, {shelter.postalCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Telefon
                    </Typography>
                    <Typography variant="body1">{shelter.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{shelter.email}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/shelters/${shelter.id}`)}
                    >
                      Menhely megtekintése
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default AnimalDetailPage
