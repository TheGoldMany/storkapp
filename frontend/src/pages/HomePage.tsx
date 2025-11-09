import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import PetsIcon from '@mui/icons-material/Pets'
import SearchIcon from '@mui/icons-material/Search'
import FavoriteIcon from '@mui/icons-material/Favorite'
import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map'
import { useTranslation } from 'react-i18next'
import PetMap from '../components/PetMap'

const HomePage = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('home.hero.title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t('home.hero.subtitle')}
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/lost-pets"
          >
            {t('lostPets.report')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            to="/animals"
          >
            {t('home.hero.cta')}
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Grid container spacing={4} sx={{ py: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('home.features.adopt.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('home.features.adopt.description')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <HomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('shelters.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('shelters.subtitle')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <FavoriteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('home.features.learn.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('home.features.learn.description')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <PetsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('home.features.report.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('home.features.report.description')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pet Map Section */}
      <Box sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <MapIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom>
            {t('map.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('map.subtitle')}
          </Typography>
        </Box>
        <PetMap />
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#d32f2f', borderRadius: '50%' }} />
            <Typography variant="body2">{t('map.lost')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#388e3c', borderRadius: '50%' }} />
            <Typography variant="body2">{t('map.found')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#1976d2', borderRadius: '50%' }} />
            <Typography variant="body2">{t('map.reunited')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#f57c00', borderRadius: '50%' }} />
            <Typography variant="body2">{t('map.shelter')}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Csatlakozz hozzánk!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Regisztrálj menhelyként vagy magánszemélyként és segíts az állatoknak
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} to="/register">
          {t('auth.register')}
        </Button>
      </Box>
    </Container>
  )
}

export default HomePage
