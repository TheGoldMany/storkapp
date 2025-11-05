import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import PetsIcon from '@mui/icons-material/Pets'
import SearchIcon from '@mui/icons-material/Search'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HomeIcon from '@mui/icons-material/Home'

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Segítünk megtalálni az elveszett állatokat
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          AI-alapú képfelismeréssel, menhelyi állatok örökbefogadásával és közösségi segítséggel
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/lost-pets"
          >
            Elveszett állatom van
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            to="/animals"
          >
            Örökbe fogadok
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Grid container spacing={4} sx={{ py: 6 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Képfelismerés
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Automatikus összevetés az elveszett és talált állatok között
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <HomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Menhelyek
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keresd meg a környékedben lévő menhelyeket és állataikat
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <FavoriteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Támogatás
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Támogasd a menhelyeket havi előfizetéssel vagy egyszeri adománnyal
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <PetsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Állatgondozás
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Állategészségügyi tanácsok és állatorvos ajánlások
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Csatlakozz hozzánk!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Regisztrálj menhelyként vagy magánszemélyként és segíts az állatoknak
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} to="/register">
          Regisztráció
        </Button>
      </Box>
    </Container>
  )
}

export default HomePage
