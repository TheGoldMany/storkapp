import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Pagination,
} from '@mui/material'
import { Pets as PetsIcon, LocationOn as LocationIcon } from '@mui/icons-material'
import { animalAPI } from '../services/api'

const AnimalsPage = () => {
  const navigate = useNavigate()
  const [animals, setAnimals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState({
    type: '',
    city: '',
  })

  useEffect(() => {
    fetchAnimals()
  }, [page, filters])

  const fetchAnimals = async () => {
    try {
      setLoading(true)
      const params: any = { page, limit: 12 }
      if (filters.type) params.type = filters.type
      if (filters.city) params.city = filters.city

      const response = await animalAPI.getAnimals(params)
      setAnimals(response.data.data.animals)
      setTotalPages(response.data.data.pagination.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
    setPage(1) // Reset to first page when filtering
  }

  const getAnimalTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DOG: 'Kutya',
      CAT: 'Macska',
      BIRD: 'Madár',
      RABBIT: 'Nyúl',
      OTHER: 'Egyéb',
    }
    return labels[type] || type
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Örökbefogadható állatok
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Találd meg új legjobb barátodat a menhelyeken
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Típus"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <MenuItem value="">Összes</MenuItem>
              <MenuItem value="DOG">Kutya</MenuItem>
              <MenuItem value="CAT">Macska</MenuItem>
              <MenuItem value="BIRD">Madár</MenuItem>
              <MenuItem value="RABBIT">Nyúl</MenuItem>
              <MenuItem value="OTHER">Egyéb</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Város"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Pl. Budapest"
            />
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {animals.map((animal) => (
                <Grid item xs={12} sm={6} md={4} key={animal.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PetsIcon sx={{ fontSize: 80, color: 'grey.400' }} />
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="h6">{animal.name}</Typography>
                        <Chip
                          label={getAnimalTypeLabel(animal.type)}
                          size="small"
                          color="primary"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {animal.breed || 'Keverék'} • {animal.age ? `${animal.age} hónapos` : 'Ismeretlen kor'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                        {animal.description?.substring(0, 100)}
                        {animal.description?.length > 100 && '...'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {animal.shelter.name}, {animal.shelter.city}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        {animal.vaccinated && <Chip label="Oltva" size="small" sx={{ mr: 0.5, mb: 0.5 }} />}
                        {animal.neutered && <Chip label="Ivartalanítva" size="small" sx={{ mr: 0.5, mb: 0.5 }} />}
                        {animal.microchipped && <Chip label="Chippelve" size="small" sx={{ mr: 0.5, mb: 0.5 }} />}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => navigate(`/animals/${animal.id}`)}
                      >
                        Részletek
                      </Button>
                      <Button
                        size="small"
                        onClick={() => navigate(`/shelters/${animal.shelter.id}`)}
                      >
                        Menhely
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {animals.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <PetsIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Nincs található állat ezekkel a keresési feltételekkel
                </Typography>
              </Box>
            )}

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
      </Box>
    </Container>
  )
}

export default AnimalsPage
