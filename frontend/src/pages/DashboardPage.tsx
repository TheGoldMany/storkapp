import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pets as PetsIcon,
  Home as HomeIcon,
} from '@mui/icons-material'
import { RootState } from '../store/store'
import { shelterAPI, animalAPI } from '../services/api'

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [shelter, setShelter] = useState<any>(null)
  const [animals, setAnimals] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Animal dialog
  const [openAnimalDialog, setOpenAnimalDialog] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<any>(null)
  const [animalForm, setAnimalForm] = useState({
    name: '',
    type: 'DOG',
    breed: '',
    age: '',
    gender: 'male',
    size: 'medium',
    color: '',
    description: '',
    vaccinated: false,
    neutered: false,
    microchipped: false,
    healthIssues: '',
  })

  useEffect(() => {
    if (user?.role === 'SHELTER_ADMIN') {
      fetchShelterData()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchShelterData = async () => {
    try {
      setLoading(true)
      const response = await shelterAPI.getMyShelter()
      setShelter(response.data.data.shelter)
      setAnimals(response.data.data.shelter.animals || [])
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Még nem hoztál létre menhelyet')
      } else {
        setError('Hiba történt az adatok betöltésekor')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAnimalDialog = (animal?: any) => {
    if (animal) {
      setEditingAnimal(animal)
      setAnimalForm({
        name: animal.name,
        type: animal.type,
        breed: animal.breed || '',
        age: animal.age?.toString() || '',
        gender: animal.gender || 'male',
        size: animal.size || 'medium',
        color: animal.color || '',
        description: animal.description || '',
        vaccinated: animal.vaccinated,
        neutered: animal.neutered,
        microchipped: animal.microchipped,
        healthIssues: animal.healthIssues || '',
      })
    } else {
      setEditingAnimal(null)
      setAnimalForm({
        name: '',
        type: 'DOG',
        breed: '',
        age: '',
        gender: 'male',
        size: 'medium',
        color: '',
        description: '',
        vaccinated: false,
        neutered: false,
        microchipped: false,
        healthIssues: '',
      })
    }
    setOpenAnimalDialog(true)
  }

  const handleCloseAnimalDialog = () => {
    setOpenAnimalDialog(false)
    setEditingAnimal(null)
  }

  const handleAnimalFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setAnimalForm({
      ...animalForm,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSaveAnimal = async () => {
    try {
      const data = {
        ...animalForm,
        age: animalForm.age ? parseInt(animalForm.age) : null,
      }

      if (editingAnimal) {
        await animalAPI.updateAnimal(editingAnimal.id, data)
      } else {
        await animalAPI.createAnimal(data)
      }

      handleCloseAnimalDialog()
      fetchShelterData()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Hiba történt')
    }
  }

  const handleDeleteAnimal = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt az állatot?')) return

    try {
      await animalAPI.deleteAnimal(id)
      fetchShelterData()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Hiba történt a törlés során')
    }
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // User Dashboard
  if (user?.role === 'USER') {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Üdvözlünk, {user.firstName}!
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Menhely létrehozása
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Ha menhelyet üzemeltetsz, regisztrálhatod és kezdheted el kezelni az állataid adatait.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/shelter/register')}
                  >
                    Menhely regisztrálása
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Elveszett állat bejelentése
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Jelentsd be elveszett kisállatodat és segítünk megtalálni.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/lost-pets')}
                  >
                    Bejelentés
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Talált állat bejelentése
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Találtál egy kóbor állatot? Jelentsd be itt.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/found-pets')}
                  >
                    Bejelentés
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Állatok böngészése
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Nézd meg az örökbefogadható állatokat a környékeden.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/animals')}
                  >
                    Böngészés
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    )
  }

  // Shelter Dashboard
  if (user?.role === 'SHELTER_ADMIN') {
    if (error) {
      return (
        <Container maxWidth="lg">
          <Box sx={{ mt: 4 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/shelter/register')}
            >
              Menhely létrehozása
            </Button>
          </Box>
        </Container>
      )
    }

    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">
              {shelter?.name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAnimalDialog()}
            >
              Új állat hozzáadása
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{animals.length}</Typography>
                <Typography variant="body2" color="text.secondary">Összes állat</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">
                  {animals.filter((a) => a.status === 'AVAILABLE').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">Örökbefogadható</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" color="info.main">
                  {animals.filter((a) => a.status === 'ADOPTED').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">Örökbefogadva</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom>
            Állatok
          </Typography>

          <Grid container spacing={2}>
            {animals.map((animal) => (
              <Grid item xs={12} sm={6} md={4} key={animal.id}>
                <Card>
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
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6">{animal.name}</Typography>
                      <Chip
                        label={getAnimalTypeLabel(animal.type)}
                        size="small"
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {animal.breed || 'Keverék'} • {animal.age ? `${animal.age} hónapos` : 'Ismeretlen kor'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {animal.description?.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {animal.vaccinated && <Chip label="Oltva" size="small" sx={{ mr: 0.5, mb: 0.5 }} />}
                      {animal.neutered && <Chip label="Ivartalanítva" size="small" sx={{ mr: 0.5, mb: 0.5 }} />}
                      {animal.microchipped && <Chip label="Chippelve" size="small" sx={{ mr: 0.5, mb: 0.5 }} />}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small" onClick={() => handleOpenAnimalDialog(animal)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteAnimal(animal.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {animals.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <PetsIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Még nincs egyetlen állat sem hozzáadva
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenAnimalDialog()}
                sx={{ mt: 2 }}
              >
                Első állat hozzáadása
              </Button>
            </Box>
          )}
        </Box>

        {/* Animal Dialog */}
        <Dialog open={openAnimalDialog} onClose={handleCloseAnimalDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingAnimal ? 'Állat szerkesztése' : 'Új állat hozzáadása'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Név"
                  name="name"
                  value={animalForm.name}
                  onChange={handleAnimalFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Típus"
                  name="type"
                  value={animalForm.type}
                  onChange={handleAnimalFormChange}
                >
                  <MenuItem value="DOG">Kutya</MenuItem>
                  <MenuItem value="CAT">Macska</MenuItem>
                  <MenuItem value="BIRD">Madár</MenuItem>
                  <MenuItem value="RABBIT">Nyúl</MenuItem>
                  <MenuItem value="OTHER">Egyéb</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fajta"
                  name="breed"
                  value={animalForm.breed}
                  onChange={handleAnimalFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Életkor (hónapokban)"
                  name="age"
                  type="number"
                  value={animalForm.age}
                  onChange={handleAnimalFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Nem"
                  name="gender"
                  value={animalForm.gender}
                  onChange={handleAnimalFormChange}
                >
                  <MenuItem value="male">Hím</MenuItem>
                  <MenuItem value="female">Nőstény</MenuItem>
                  <MenuItem value="unknown">Ismeretlen</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Méret"
                  name="size"
                  value={animalForm.size}
                  onChange={handleAnimalFormChange}
                >
                  <MenuItem value="small">Kicsi</MenuItem>
                  <MenuItem value="medium">Közepes</MenuItem>
                  <MenuItem value="large">Nagy</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Szín"
                  name="color"
                  value={animalForm.color}
                  onChange={handleAnimalFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Leírás"
                  name="description"
                  value={animalForm.description}
                  onChange={handleAnimalFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <label>
                    <input
                      type="checkbox"
                      name="vaccinated"
                      checked={animalForm.vaccinated}
                      onChange={handleAnimalFormChange}
                    />
                    {' '}Oltva
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <label>
                    <input
                      type="checkbox"
                      name="neutered"
                      checked={animalForm.neutered}
                      onChange={handleAnimalFormChange}
                    />
                    {' '}Ivartalanítva
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <label>
                    <input
                      type="checkbox"
                      name="microchipped"
                      checked={animalForm.microchipped}
                      onChange={handleAnimalFormChange}
                    />
                    {' '}Chippelve
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Egészségügyi megjegyzések"
                  name="healthIssues"
                  value={animalForm.healthIssues}
                  onChange={handleAnimalFormChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAnimalDialog}>Mégse</Button>
            <Button onClick={handleSaveAnimal} variant="contained">
              {editingAnimal ? 'Mentés' : 'Hozzáadás'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }

  return null
}

export default DashboardPage

