import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('common.appName')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.description')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('footer.links')}
            </Typography>
            <MuiLink component={Link} to="/shelters" display="block" color="text.secondary">
              {t('shelters.title')}
            </MuiLink>
            <MuiLink component={Link} to="/animals" display="block" color="text.secondary">
              {t('animals.title')}
            </MuiLink>
            <MuiLink component={Link} to="/lost-pets" display="block" color="text.secondary">
              {t('lostPets.title')}
            </MuiLink>
            <MuiLink component={Link} to="/health-info" display="block" color="text.secondary">
              {t('tips.title')}
            </MuiLink>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {t('footer.contact')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.email')}: info@storkapp.hu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.phone')}: +36 1 234 5678
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('footer.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
