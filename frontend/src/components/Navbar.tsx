import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { logout } from '../store/slices/authSlice'
import PetsIcon from '@mui/icons-material/Pets'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <PetsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Stork App
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" component={Link} to="/shelters">
              Menhelyek
            </Button>
            <Button color="inherit" component={Link} to="/animals">
              Állatok
            </Button>
            <Button color="inherit" component={Link} to="/lost-pets">
              Elveszett
            </Button>
            <Button color="inherit" component={Link} to="/found-pets">
              Talált
            </Button>
            <Button color="inherit" component={Link} to="/health-info">
              Tanácsok
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/profile">
                  {user?.firstName}
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Kilépés
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Belépés
                </Button>
                <Button variant="contained" color="secondary" component={Link} to="/register">
                  Regisztráció
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
