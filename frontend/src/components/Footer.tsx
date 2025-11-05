import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material'
import { Link } from 'react-router-dom'

const Footer = () => {
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
              Stork App
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Segítünk megtalálni elveszett háziállatokat és új otthont menhelyi állatoknak.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Linkek
            </Typography>
            <MuiLink component={Link} to="/shelters" display="block" color="text.secondary">
              Menhelyek
            </MuiLink>
            <MuiLink component={Link} to="/animals" display="block" color="text.secondary">
              Örökbefogadható állatok
            </MuiLink>
            <MuiLink component={Link} to="/lost-pets" display="block" color="text.secondary">
              Elveszett állatok
            </MuiLink>
            <MuiLink component={Link} to="/health-info" display="block" color="text.secondary">
              Állattartási tanácsok
            </MuiLink>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Kapcsolat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@storkapp.hu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Telefon: +36 1 234 5678
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Stork App. Minden jog fenntartva.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
