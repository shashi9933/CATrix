import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Link,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Container,
} from '@mui/material';
import {
  Google as GoogleIcon,
  School as SchoolIcon,
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInGuest();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in as guest');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Comprehensive Learning',
      description: 'Access a wide range of study materials and practice tests designed by experts',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Analytics',
      description: 'Track your progress with detailed performance analytics and insights',
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Practice Tests',
      description: 'Take mock tests that simulate the actual CAT exam environment',
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Expert Guidance',
      description: 'Get personalized guidance from experienced mentors and teachers',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pr: { md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  CATrix
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Your Gateway to IIMs
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Join thousands of aspirants who are preparing for CAT with CATrix. Our platform provides comprehensive study materials, practice tests, and analytics to help you achieve your dream of getting into top B-schools.
              </Typography>
              
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      {feature.icon}
                      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Login Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Sign in to continue your CAT preparation journey
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                disabled={loading}
                sx={{ mb: 3, py: 1.5 }}
              >
                Continue with Google
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ mt: 2, py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={handleGuestSignIn}
                  disabled={loading}
                  sx={{ mt: 1, py: 1.2 }}
                >
                  Continue as Guest
                </Button>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/signup" color="primary">
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login; 