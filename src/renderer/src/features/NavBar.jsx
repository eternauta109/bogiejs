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
  MenuItem
} from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'

import eyeIcon from '../assets/bigeye2.ico'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'

import useEventsStore from '../store/EventDataContext'
import { useNavigate } from 'react-router-dom'
import { Message } from './messages/Message'

const pages = ['Calendario', 'Lavagna', 'Topics', 'dashboard']

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [openMessageModal, setOpenMessgaeModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)
  const handleOpenMessageModal = () => setOpenMessgaeModal(true)
  const handleCloseMessageModal = () => setOpenMessgaeModal(false)
  const { user, logOut } = useEventsStore()

  const settings = [`name: ${user.user.userName}`, `role: ${user.user.role}`]

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
    console.log(name)
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
    console.log('menu toggle', page)
    switch (page) {
      case 'Topics':
        navigate('/topics')
        break
      case 'Lavagna':
        navigate('/kanban')
        break
      case 'Calendario':
        navigate('/calendar')
        break
      case 'dashboard':
        navigate('/dashboard')
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
    logOut()
    navigate('/')
  }

  const MenuElement = ({ page }) => {
    switch (page) {
      case 'dashboard':
        if (user.user.role === 'tm') {
          return (
            <MenuItem onClick={(e) => handleCloseNavMenu(e, page)}>
              <ListItemText primary={page} />
            </MenuItem>
          )
        }

        break
      // Gestisci tutti gli altri casi
      default:
        return (
          <MenuItem onClick={(e) => handleCloseNavMenu(e, page)}>
            <ListItemText primary={page} />
          </MenuItem>
        )
    }
  }

  return (
    <AppBar position="static" sx={{ mb: '20px', bgcolor: '#689F38' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box width={50} height={50} paddingRight={2}>
            <img src={eyeIcon} alt="icoEye" style={{ width: '100%', height: '100%' }} />
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
            BIG-EYE
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
            BigEye
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, key) => (
              <MenuElement page={page} key={key} />
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenModal} sx={{ mr: 1 }}>
              <Badge badgeContent={user.user.notification.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleOpenMessageModal}>
              <Badge color="secondary" sx={{ mr: 1 }}>
                <MailIcon />
              </Badge>
            </IconButton>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar {...stringAvatar(user.user.userName)} />
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
      <Notify onHandleClose={handleCloseModal} open={openModal} notify={user.user.notification} />
      <Message onHandleMessageClose={handleCloseMessageModal} open={openMessageModal} />
    </AppBar>
  )
}
export default NavBar
