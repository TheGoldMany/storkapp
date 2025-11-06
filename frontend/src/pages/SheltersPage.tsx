import React, { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Pagination,
  Chip,
  Avatar,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LanguageIcon from '@mui/icons-material/Language'
import PetsIcon from '@mui/icons-material/Pets'
import { shelterAPI } from '../services/api'

const SheltersPage = () => {
  const navigate = useNavigate()
  const [shelters, setShelters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    city: '',
    search: '',
  })

  useEffect(() => {
    fetchShelters()
  }, [page, filters])

  const fetchShelters = async () => {
    try {
      setLoading(true)
      const params: any = { page, limit: 12 }
      if (filters.city) params.city = filters.city
      if (filters.search) params.search = filters.search

      const response = await shelterAPI.getShelters(params)
      setShelters(response.data.data.shelters)
      setTotalPages(response.data.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch shelters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(1) // Reset to first page when filters change
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Menhelyek
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Böngéssz az országos menhelyek között, és találd meg a számodra ideális állatot
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Keresés név alapján"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Menhely neve..."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Város"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Város szűrés..."
            />
          </Grid>
        </Grid>
      </Box>

      {/* Shelters Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Betöltés...</Typography>
        </Box>
      ) : shelters.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PetsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nem találtunk menhelyeket a megadott szűrőkkel
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {shelters.map((shelter) => (
              <Grid item xs={12} sm={6} md={4} key={shelter.id}>
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
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      bgcolor: 'primary.light',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.main',
                        fontSize: 32,
                      }}
                    >
                      {shelter.name.charAt(0)}
                    </Avatar>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {shelter.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, minHeight: 40 }}
                    >
                      {shelter.description?.substring(0, 100)}
                      {shelter.description?.length > 100 ? '...' : ''}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {shelter.city}, {shelter.postalCode}
                      </Typography>
                    </Box>

                    {shelter.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{shelter.phone}</Typography>
                      </Box>
                    )}

                    {shelter.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {shelter.email}
                        </Typography>
                      </Box>
                    )}

                    {shelter.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LanguageIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {shelter.website}
                        </Typography>
                      </Box>
                    )}

                    {shelter._count?.animals > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          icon={<PetsIcon />}
                          label={`${shelter._count.animals} állat`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/shelters/${shelter.id}`)}
                    >
                      Részletek megtekintése
                    </Button>
                  </CardActions>
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

export default SheltersPage
