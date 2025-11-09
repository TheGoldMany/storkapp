import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Pagination,
  Chip,
  Paper,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PetsIcon from '@mui/icons-material/Pets'
import { useTranslation } from 'react-i18next'
import { foundPetAPI } from '../services/api'

const FoundPetsPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [foundPets, setFoundPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    type: '',
    city: '',
  })

  useEffect(() => {
    fetchFoundPets()
  }, [page, filters])

  const fetchFoundPets = async () => {
    try {
      setLoading(true)
      const params: any = { page, limit: 12 }
      if (filters.type) params.type = filters.type
      if (filters.city) params.city = filters.city

      const response = await foundPetAPI.getFoundPets(params)
      setFoundPets(response.data.data.foundPets || [])
      setTotalPages(response.data.data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch found pets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hu-HU')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" gutterBottom>
            {t('foundPets.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('foundPets.subtitle')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/found-pets/report')}
          size="large"
        >
          {t('foundPets.report')}
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label={t('animals.type')}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">{t('common.all')}</option>
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
              label={t('foundPets.city')}
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Found Pets Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>{t('common.loading')}</Typography>
        </Box>
      ) : foundPets.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <PetsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('foundPets.noFoundPets')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/found-pets/report')}
            sx={{ mt: 2 }}
          >
            {t('foundPets.report')}
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {foundPets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} key={pet.id}>
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
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/found-pets/${pet.id}`)}
                >
                  <CardMedia
                    sx={{
                      height: 200,
                      bgcolor: 'success.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: pet.images?.length > 0
                        ? `url(http://localhost:3000${pet.images[0]})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!pet.images?.length && (
                      <PetsIcon sx={{ fontSize: 64, color: 'success.main' }} />
                    )}
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={t(`animals.types.${pet.type}`)}
                        size="small"
                        color="success"
                        sx={{ mr: 1 }}
                      />
                      {pet.breed && (
                        <Chip label={pet.breed} size="small" variant="outlined" />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {pet.foundLocation}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(pet.foundDate)}
                      </Typography>
                    </Box>

                    {pet.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {pet.description.substring(0, 120)}
                        {pet.description.length > 120 ? '...' : ''}
                      </Typography>
                    )}

                    {pet.temporaryLocation && (
                      <Box sx={{ mt: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="caption" color="info.dark">
                          {t('foundPets.temporaryLocationLabel')}: {pet.temporaryLocation}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default FoundPetsPage
