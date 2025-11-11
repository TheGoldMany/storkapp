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
import { shelterAPI, animalAPI, lostPetAPI, foundPetAPI } from '../services/api'
import ImageUpload from '../components/ImageUpload'

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [shelter, setShelter] = useState<any>(null)
  const [animals, setAnimals] = useState<any[]>([])
  const [myLostPets, setMyLostPets] = useState<any[]>([])
  const [myFoundPets, setMyFoundPets] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Animal dialog
  const [openAnimalDialog, setOpenAnimalDialog] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<any>(null)
  const [animalForm, setAnimalForm] = useState({
    name: '',
    type: 'DOG',
    breed: '',
    age: '',
    ageUnit: 'hónap',
    gender: 'MALE',
    size: 'medium',
    color: '',
    description: '',
    specialNeeds: '',
    images: [] as string[],
    vaccinated: false,
    neutered: false,
    microchipped: false,
    healthIssues: '',
    status: 'AVAILABLE',
  })

  useEffect(() => {
    if (user?.role === 'SHELTER_ADMIN') {
      fetchShelterData()
    } else if (user?.role === 'USER') {
      fetchUserReports()
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

  const fetchUserReports = async () => {
    try {
      setLoading(true)
      const [lostPetsResponse, foundPetsResponse] = await Promise.all([
        lostPetAPI.getMyLostPets(),
        foundPetAPI.getMyFoundPets(),
      ])
      setMyLostPets(lostPetsResponse.data.data.lostPets || [])
      setMyFoundPets(foundPetsResponse.data.data.foundPets || [])
    } catch (err: any) {
      setError('Hiba történt az adatok betöltésekor')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLostPet = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a bejelentést?')) return
    try {
      await lostPetAPI.deleteLostPet(id)
      fetchUserReports()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Hiba történt a törlés során')
    }
  }

  const handleDeleteFoundPet = async (id: string) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a bejelentést?')) return
    try {
      await foundPetAPI.deleteFoundPet(id)
      fetchUserReports()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Hiba történt a törlés során')
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
        ageUnit: animal.ageUnit || 'hónap',
        gender: animal.gender || 'MALE',
        size: animal.size || 'medium',
        color: animal.color || '',
        description: animal.description || '',
        specialNeeds: animal.specialNeeds || '',
        images: animal.images || [],
        vaccinated: animal.vaccinated,
        neutered: animal.neutered,
        microchipped: animal.microchipped,
        healthIssues: animal.healthIssues || '',
        status: animal.status || 'AVAILABLE',
      })
    } else {
      setEditingAnimal(null)
      setAnimalForm({
        name: '',
        type: 'DOG',
        breed: '',
        age: '',
        ageUnit: 'hónap',
        gender: 'MALE',
        size: 'medium',
        color: '',
        description: '',
        specialNeeds: '',
        images: [],
        vaccinated: false,
        neutered: false,
        microchipped: false,
        healthIssues: '',
        status: 'AVAILABLE',
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
      setSaving(true)
      const data = {
        ...animalForm,
        age: animalForm.age ? parseInt(animalForm.age) : null,
      }

      console.log('Saving animal with data:', data)

      if (editingAnimal) {
        console.log('Updating animal:', editingAnimal.id)
        const response = await animalAPI.updateAnimal(editingAnimal.id, data)
        console.log('Update response:', response)
      } else {
        console.log('Creating new animal')
        const response = await animalAPI.createAnimal(data)
        console.log('Create response:', response)
      }

      handleCloseAnimalDialog()
      fetchShelterData()
    } catch (err: any) {
      console.error('Error saving animal:', err)
      console.error('Error response:', err.response)
      const errorMessage = err.response?.data?.message || err.message || 'Hiba történt az állat mentése során'
      alert(`HIBA: ${errorMessage}\n\nEllenőrizd, hogy az adatbázis migráció alkalmazva lett-e!`)
    } finally {
      setSaving(false)
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
                    color="error"
                    onClick={() => navigate('/lost-pets/report')}
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
                    color="success"
                    onClick={() => navigate('/found-pets/report')}
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

          {/* My Reports Section */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Saját bejelentéseim
            </Typography>

            {/* Lost Pets */}
            <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'error.main' }}>
              Elveszett állatok ({myLostPets.length})
            </Typography>
            {myLostPets.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Még nincs elveszett állat bejelentve
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {myLostPets.map((pet) => (
                  <Grid item xs={12} sm={6} md={4} key={pet.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{pet.name || 'Névtelen'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pet.lastSeenLocation}, {pet.lastSeenCity}
                        </Typography>
                        <Chip
                          label={pet.status}
                          size="small"
                          color="error"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/lost-pets/${pet.id}`)}>
                          Megtekintés
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteLostPet(pet.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Found Pets */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: 'success.main' }}>
              Talált állatok ({myFoundPets.length})
            </Typography>
            {myFoundPets.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Még nincs talált állat bejelentve
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {myFoundPets.map((pet) => (
                  <Grid item xs={12} sm={6} md={4} key={pet.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Talált {pet.type}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pet.foundLocation}, {pet.foundCity}
                        </Typography>
                        <Chip
                          label={pet.status}
                          size="small"
                          color="success"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/found-pets/${pet.id}`)}>
                          Megtekintés
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFoundPet(pet.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
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
                    sx={{
                      height: 200,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: animal.images?.length > 0
                        ? `url(http://localhost:3000${animal.images[0]})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!animal.images?.length && (
                      <PetsIcon sx={{ fontSize: 80, color: 'grey.400' }} />
                    )}
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
                      {animal.breed || 'Keverék'} • {animal.age ? `${animal.age} ${animal.ageUnit || 'hónap'}` : 'Ismeretlen kor'}
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Életkor"
                  name="age"
                  type="number"
                  value={animalForm.age}
                  onChange={handleAnimalFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  select
                  label="Egység"
                  name="ageUnit"
                  value={animalForm.ageUnit}
                  onChange={handleAnimalFormChange}
                >
                  <MenuItem value="hét">hét</MenuItem>
                  <MenuItem value="hónap">hónap</MenuItem>
                  <MenuItem value="év">év</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Nem"
                  name="gender"
                  value={animalForm.gender}
                  onChange={handleAnimalFormChange}
                >
                  <MenuItem value="MALE">Hím</MenuItem>
                  <MenuItem value="FEMALE">Nőstény</MenuItem>
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
              {editingAnimal && (
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    select
                    label="Státusz"
                    name="status"
                    value={animalForm.status}
                    onChange={handleAnimalFormChange}
                  >
                    <MenuItem value="AVAILABLE">Elérhető</MenuItem>
                    <MenuItem value="ADOPTED">Örökbefogadva</MenuItem>
                    <MenuItem value="STRAY">Kóbor</MenuItem>
                    <MenuItem value="RESERVED">Lefoglalva</MenuItem>
                    <MenuItem value="MEDICAL_CARE">Kezelés alatt</MenuItem>
                    <MenuItem value="NOT_AVAILABLE">Nem elérhető</MenuItem>
                  </TextField>
                </Grid>
              )}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Különleges igények"
                  name="specialNeeds"
                  value={animalForm.specialNeeds}
                  onChange={handleAnimalFormChange}
                  placeholder="Allergiák, speciális táplálkozás, stb."
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Állat képei
                </Typography>
                <ImageUpload
                  value={animalForm.images}
                  onChange={(images) => setAnimalForm({ ...animalForm, images })}
                  multiple
                  maxImages={5}
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
            <Button onClick={handleCloseAnimalDialog} disabled={saving}>Mégse</Button>
            <Button
              onClick={handleSaveAnimal}
              variant="contained"
              disabled={saving}
            >
              {saving ? 'Mentés...' : (editingAnimal ? 'Mentés' : 'Hozzáadás')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }

  return null
}

export default DashboardPage

