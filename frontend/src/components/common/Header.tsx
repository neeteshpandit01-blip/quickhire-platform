import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Work,
  Chat,
  Settings,
  Logout,
  Star,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { getInitials } from '../../utils/formatters';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleClose();
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'client' ? '/client/dashboard' : '/student/dashboard';
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            QuickHire
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to={getDashboardLink()}
                startIcon={<Dashboard />}
              >
                Dashboard
              </Button>
              
              {user?.role === 'client' && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/client/post-gig"
                  startIcon={<Work />}
                >
                  Post Gig
                </Button>
              )}
              
              {user?.role === 'student' && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/student/browse"
                  startIcon={<Work />}
                >
                  Browse Gigs
                </Button>
              )}

              <IconButton
                color="inherit"
                component={RouterLink}
                to="/chat"
              >
                <Chat />
              </IconButton>

              {user?.isPremium && (
                <Chip
                  icon={<Star />}
                  label="Premium"
                  color="secondary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}

              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {user?.profilePicture ? (
                  <Avatar src={user.profilePicture} sx={{ width: 32, height: 32 }} />
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user?.name ? getInitials(user.name) : <AccountCircle />}
                  </Avatar>
                )}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <AccountCircle sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                  <Settings sx={{ mr: 1 }} /> Settings
                </MenuItem>
                {!user?.isPremium && (
                  <MenuItem onClick={() => { navigate('/premium'); handleClose(); }}>
                    <Star sx={{ mr: 1 }} /> Upgrade to Premium
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/register"
                sx={{ ml: 2 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
