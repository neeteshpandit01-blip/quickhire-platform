import { Outlet } from 'react-router-dom';
import { Box, Container, Paper } from '@mui/material';

const AuthLayout = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Outlet />
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthLayout;
