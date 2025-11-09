import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { logout } from '../store/slices/authSlice'
import PetsIcon from '@mui/icons-material/Pets'
import LanguageIcon from '@mui/icons-material/Language'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget)
  }

  const handleLanguageMenuClose = () => {
    setLangAnchorEl(null)
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    handleLanguageMenuClose()
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
            {t('common.appName')}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" component={Link} to="/shelters">
              {t('nav.shelters')}
            </Button>
            <Button color="inherit" component={Link} to="/animals">
              {t('nav.animals')}
            </Button>
            <Button color="inherit" component={Link} to="/lost-pets">
              {t('nav.lostPets')}
            </Button>
            <Button color="inherit" component={Link} to="/found-pets">
              {t('nav.foundPets')}
            </Button>
            <Button color="inherit" component={Link} to="/tips">
              {t('nav.tips')}
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleLanguageMenuOpen}
              sx={{ ml: 1 }}
            >
              <LanguageIcon />
            </IconButton>
            <Menu
              anchorEl={langAnchorEl}
              open={Boolean(langAnchorEl)}
              onClose={handleLanguageMenuClose}
            >
              <MenuItem onClick={() => handleLanguageChange('hu')}>
                🇭🇺 Magyar
              </MenuItem>
              <MenuItem onClick={() => handleLanguageChange('en')}>
                🇬🇧 English
              </MenuItem>
              <MenuItem onClick={() => handleLanguageChange('pl')}>
                🇵🇱 Polski
              </MenuItem>
              <MenuItem onClick={() => handleLanguageChange('de')}>
                🇩🇪 Deutsch
              </MenuItem>
            </Menu>

            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard">
                  {t('nav.dashboard')}
                </Button>
                <Button color="inherit" component={Link} to="/profile">
                  {user?.firstName}
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  {t('nav.login')}
                </Button>
                <Button variant="contained" color="secondary" component={Link} to="/register">
                  {t('nav.register')}
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
