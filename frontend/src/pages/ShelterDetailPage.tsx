import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Chip,
  Avatar,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LanguageIcon from '@mui/icons-material/Language'
import PetsIcon from '@mui/icons-material/Pets'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { shelterAPI, animalAPI } from '../services/api'

const ShelterDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [shelter, setShelter] = useState<any>(null)
  const [animals, setAnimals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchShelterData()
    }
  }, [id])

  const fetchShelterData = async () => {
    try {
      setLoading(true)
      const [shelterResponse, animalsResponse] = await Promise.all([
        shelterAPI.getShelterById(id!),
        animalAPI.getAnimals({ shelterId: id }),
      ])
      setShelter(shelterResponse.data.data)
      setAnimals(animalsResponse.data.data.animals || [])
    } catch (error) {
      console.error('Failed to fetch shelter data:', error)
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

  if (!shelter) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Menhely nem található</Typography>
        <Button onClick={() => navigate('/shelters')} sx={{ mt: 2 }}>
          Vissza a menhelyekhez
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/shelters')}
        sx={{ mb: 3 }}
      >
        Vissza a menhelyekhez
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{
                width: 150,
                height: 150,
                bgcolor: 'primary.main',
                fontSize: 48,
              }}
            >
              {shelter.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h3" gutterBottom>
              {shelter.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {shelter.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Cím
                    </Typography>
                    <Typography variant="body1">
                      {shelter.address}
                      <br />
                      {shelter.city}, {shelter.postalCode}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Telefon
                    </Typography>
                    <Typography variant="body1">{shelter.phone}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{shelter.email}</Typography>
                  </Box>
                </Box>
              </Grid>

              {shelter.website && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Weboldal
                      </Typography>
                      <Typography variant="body1">
                        <a href={shelter.website} target="_blank" rel="noopener noreferrer">
                          {shelter.website}
                        </a>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {shelter.bankAccount && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Bankszámlaszám (adományozáshoz)
                      </Typography>
                      <Typography variant="body1">{shelter.bankAccount}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {shelter.taxNumber && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Adószám
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {shelter.taxNumber}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Animals Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <PetsIcon sx={{ mr: 1 }} />
          Örökbefogadható állatok ({animals.length})
        </Typography>
      </Box>

      {animals.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <PetsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Jelenleg nincsenek örökbefogadható állatok
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {animals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s',
                  },
                }}
              >
                <CardMedia
                  sx={{
                    height: 200,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PetsIcon sx={{ fontSize: 64, color: 'primary.main' }} />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {animal.name}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip label={animal.type} size="small" color="primary" sx={{ mr: 1 }} />
                    <Chip label={animal.breed} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Kor:</strong> {animal.age} {animal.ageUnit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Nem:</strong> {animal.gender === 'MALE' ? 'Hím' : 'Nőstény'}
                  </Typography>
                  {animal.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {animal.description.substring(0, 100)}
                      {animal.description.length > 100 ? '...' : ''}
                    </Typography>
                  )}
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/animals/${animal.id}`)}
                  >
                    Részletek
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default ShelterDetailPage
