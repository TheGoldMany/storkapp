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
  CircularProgress,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PetsIcon from '@mui/icons-material/Pets'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import { useTranslation } from 'react-i18next'
import { foundPetAPI } from '../services/api'

const FoundPetDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [pet, setPet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchPetData()
    }
  }, [id])

  const fetchPetData = async () => {
    try {
      setLoading(true)
      const response = await foundPetAPI.getFoundPetById(id!)
      setPet(response.data.data)
    } catch (error) {
      console.error('Failed to fetch found pet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!pet) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>{t('foundPets.notFound')}</Typography>
        <Button onClick={() => navigate('/found-pets')} sx={{ mt: 2 }}>
          {t('foundPets.backToList')}
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/found-pets')}
        sx={{ mb: 3 }}
      >
        {t('foundPets.backToList')}
      </Button>

      <Grid container spacing={4}>
        {/* Pet Image/Icon Section */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'success.light',
              position: 'relative',
              backgroundImage: pet.images?.length > 0
                ? `url(http://localhost:3000${pet.images[0]})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: pet.images?.length > 0 ? 'pointer' : 'default',
            }}
            onClick={() => pet.images?.length > 0 && setSelectedImage(pet.images[0])}
          >
            {!pet.images?.length && (
              <PetsIcon sx={{ fontSize: 120, color: 'success.main' }} />
            )}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Chip
                label={t(`foundPets.statuses.${pet.status}`)}
                color="success"
                size="medium"
              />
            </Box>
          </Paper>
          {pet.images?.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
              {pet.images.map((img: string, idx: number) => (
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
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Pet Details Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom color="success.main">
              {t('foundPets.foundPet')}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Chip label={t(`animals.types.${pet.type}`)} color="success" sx={{ mr: 1 }} />
              {pet.breed && <Chip label={pet.breed} variant="outlined" sx={{ mr: 1 }} />}
              {pet.gender && (
                <Chip
                  label={pet.gender === 'MALE' ? 'Hím' : 'Nőstény'}
                  variant="outlined"
                />
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {pet.age && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('animals.age')}
                  </Typography>
                  <Typography variant="body1">{pet.age} {t('animals.monthsOld')}</Typography>
                </Grid>
              )}
              {pet.size && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('animals.size')}
                  </Typography>
                  <Typography variant="body1">{pet.size}</Typography>
                </Grid>
              )}
              {pet.color && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('animals.color')}
                  </Typography>
                  <Typography variant="body1">{pet.color}</Typography>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body1">
                  <strong>{t('foundPets.foundLocation')}:</strong> {pet.foundLocation}, {pet.foundCity}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  <strong>{t('foundPets.foundDate')}:</strong> {formatDate(pet.foundDate)}
                </Typography>
              </Box>
              {pet.currentLocation && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body1">
                    <strong>{t('foundPets.temporaryLocationLabel')}:</strong> {pet.currentLocation}
                  </Typography>
                </Box>
              )}
            </Box>

            {pet.description && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t('animals.description')}
                </Typography>
                <Typography variant="body1" paragraph>
                  {pet.description}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {t('foundPets.finderInfo')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t('foundPets.finderName')}
                  </Typography>
                  <Typography variant="body1">{pet.finderName}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('foundPets.finderPhone')}
                      </Typography>
                      <Typography variant="body1">
                        <a href={`tel:${pet.finderPhone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {pet.finderPhone}
                        </a>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {pet.finderEmail && (
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('foundPets.finderEmail')}
                        </Typography>
                        <Typography variant="body1">
                          <a href={`mailto:${pet.finderEmail}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {pet.finderEmail}
                          </a>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Image Lightbox */}
      {selectedImage && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer',
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`http://localhost:3000${selectedImage}`}
            alt="Pet"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
            }}
          />
        </Box>
      )}
    </Container>
  )
}

export default FoundPetDetailPage
