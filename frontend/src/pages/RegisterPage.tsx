import { Container, Typography, Box } from '@mui/material'

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4">Regisztráció</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Registration form will be implemented here
        </Typography>
      </Box>
    </Container>
  )
}

export default RegisterPage
