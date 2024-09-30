/* eslint-disable react/prop-types */
import React, { useState } from 'react'

import { Notify } from './notification/Notify'

import {
  ListItemText,
  Badge,
  IconButton,
  Typography,
  AppBar,
  Box,
  Toolbar,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Button
} from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TopicIcon from '@mui/icons-material/Topic'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import eyeIcon from '../assets/bigeye2.ico'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'

import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Message } from './messages/Message'

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [openMessageModal, setOpenMessgaeModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)
  const handleOpenMessageModal = () => setOpenMessgaeModal(true)
  const handleCloseMessageModal = () => setOpenMessgaeModal(false)

  const user = useSelector((state) => state.managers.user)
  console.log('navbar user', user)

  const pages = [
    { name: 'Gestione Prodotti', icon: <CalendarTodayIcon /> },
    { name: 'Rifornisci YumTrek', icon: <DashboardIcon /> },

    { name: 'Home', icon: <TopicIcon /> },
    { name: 'carica spettacoli', icon: <TopicIcon /> },
    { name: 'cassa', icon: <TopicIcon /> },
    ...(user.role === 'tm' ? [{ name: 'dashboard', icon: <ManageAccountsIcon /> }] : [])
  ]

  const settings = [`name: ${user.userName}`, `role: ${user.role}`]

  const navigate = useNavigate()

  function stringToColor(string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name) {
    const firstLetter = name[0]
    const lastLetter = name[name.length - 1]
    return {
      sx: {
        bgcolor: stringToColor(name)
      },
      children: `${firstLetter}${lastLetter}`
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = (e, page) => {
    switch (page) {
      case 'Gestione Prodotti':
        navigate('/manage-products')
        break
      case 'Rifornisci YumTrek':
        navigate('/supplies')
        break
      case 'Home':
        navigate('/landing')
        break
      case 'dashboard':
        navigate('/dashboard')
        break
      case 'carica spettacoli':
        navigate('/loader')
        break
      case 'cassa':
        navigate('/YumCart')
        break
      default:
        break
    }
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogout = () => {
    /* logOut() */
    navigate('/')
  }

  const MenuElement = ({ page }) => {
    return (
      <MenuItem onClick={(e) => handleCloseNavMenu(e, page.name)}>
        {page.icon}
        <ListItemText primary={page.name} />
      </MenuItem>
    )
  }

  return (
    <AppBar
      position="static"
      sx={{
        mb: '20px',
        background: 'linear-gradient(45deg, #3498DB 30%, #58D68D 90%)',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        borderRadius: '10px'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            width={50}
            height={50}
            paddingRight={2}
            sx={{
              '&:hover': {
                transform: 'rotate(360deg)',
                transition: 'transform 0.5s ease-in-out'
              }
            }}
          >
            <img
              src={eyeIcon}
              alt="icoEye"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            YumTrek
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map((page, key) => (
                <MenuElement page={page} key={key} />
              ))}
            </Menu>
          </Box>
          <RemoveRedEyeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            YumTrek
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page, key) => (
              <Button
                key={key}
                onClick={(e) => handleCloseNavMenu(e, page.name)}
                startIcon={page.icon}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  mx: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleOpenModal} sx={{ mr: 1, color: 'inherit' }}>
              <Badge badgeContent={user.notification.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleOpenMessageModal} sx={{ color: 'inherit' }}>
              <Badge color="secondary" sx={{ mr: 1 }}>
                <MailIcon />
              </Badge>
            </IconButton>
            <Tooltip title="user">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                <Avatar {...stringAvatar(user.userName)} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
              <MenuItem key="logout" onClick={handleLogout}>
                <Typography color="secondary">LogOut</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <Notify onHandleClose={handleCloseModal} open={openModal} notify={user.notification} />
      <Message onHandleMessageClose={handleCloseMessageModal} open={openMessageModal} />
    </AppBar>
  )
}

export default NavBar
