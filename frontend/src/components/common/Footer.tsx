import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

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
              QuickHire
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Students meet opportunities. Clients meet talent.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/about" color="text.secondary" display="block">
              About Us
            </Link>
            <Link component={RouterLink} to="/how-it-works" color="text.secondary" display="block">
              How It Works
            </Link>
            <Link component={RouterLink} to="/premium" color="text.secondary" display="block">
              Premium
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Support
            </Typography>
            <Link component={RouterLink} to="/help" color="text.secondary" display="block">
              Help Center
            </Link>
            <Link component={RouterLink} to="/terms" color="text.secondary" display="block">
              Terms of Service
            </Link>
            <Link component={RouterLink} to="/privacy" color="text.secondary" display="block">
              Privacy Policy
            </Link>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          © {new Date().getFullYear()} QuickHire. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
