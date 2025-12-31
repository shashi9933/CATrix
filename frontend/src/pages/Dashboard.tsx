import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Divider,
  Container,
  Link,
} from '@mui/material';
import {
  PlayArrow as StartTestIcon,
  MenuBook as StudyIcon,
  Analytics as AnalyticsIcon,
  Chat as AssistantIcon,
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  School as SchoolIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickAccessCard = ({
  title,
  description,
  icon,
  path,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          cursor: 'pointer',
        },
      }}
      onClick={() => navigate(path)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ProgressCard = ({ title, value, target, color }: { title: string; value: number; target: number; color: string }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" component="div" sx={{ mr: 1 }}>
          {value}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          of {target}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(value / target) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const quickAccessItems = [
    {
      title: 'Start Test',
      description: 'Begin your practice with our comprehensive test series',
      icon: <StartTestIcon color="primary" />,
      path: '/test-series',
    },
    {
      title: 'Study Materials',
      description: 'Access curated study materials and resources',
      icon: <StudyIcon color="primary" />,
      path: '/study-materials',
    },
    {
      title: 'View Analytics',
      description: 'Track your progress and performance metrics',
      icon: <AnalyticsIcon color="primary" />,
      path: '/analytics',
    },
    {
      title: 'Ask Assistant',
      description: 'Get instant help from our AI-powered assistant',
      icon: <AssistantIcon color="primary" />,
      path: '/assistant',
    },
  ];

  const upcomingTests = [
    {
      title: 'CAT 2024 Mock Test 1',
      date: '2024-03-20',
      time: '10:00 AM',
      duration: '180 mins',
    },
    {
      title: 'VARC Section Test',
      date: '2024-03-22',
      time: '2:00 PM',
      duration: '60 mins',
    },
    {
      title: 'LRDI Practice Test',
      date: '2024-03-25',
      time: '11:00 AM',
      duration: '60 mins',
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'KIttu', score: 98.5, avatar: 'RS' },
    { rank: 2, name: 'kittu', score: 97.8, avatar: 'PP' },
    { rank: 3, name: 'kittu', score: 96.2, avatar: 'AK' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 6,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(90deg, #6C63FF 0%, #4A45B3 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          boxShadow: '0 4px 24px 0 rgba(108,99,255,0.10)',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 120 }}>
          <TrophyIcon sx={{ fontSize: 80, color: 'white', mr: 2 }} />
        </Box>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}>
            CATrix: Your Gateway to IIMs
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, mb: 2 }}>
            Master CAT with smart analytics, unlimited practice, and expert resources.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ borderRadius: 3, fontWeight: 600, px: 4, py: 1.5, fontSize: '1.1rem' }}
            startIcon={<TrendingIcon />}
          >
            Start Your Journey
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Access Cards */}
        {quickAccessItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <QuickAccessCard {...item} />
          </Grid>
        ))}

        {/* Progress Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <ProgressCard title="VARC" value={75} target={85} color="#6C63FF" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ProgressCard title="LRDI" value={65} target={80} color="#FF6B6B" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ProgressCard title="Quant" value={70} target={85} color="#4CAF50" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Leaderboard */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrophyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Top Performers</Typography>
              </Box>
              <List>
                {leaderboard.map((user) => (
                  <ListItem key={user.rank}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{user.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={`Score: ${user.score}%`}
                    />
                    <Chip
                      label={`#${user.rank}`}
                      color={user.rank === 1 ? 'secondary' : 'default'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tests */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Upcoming Tests</Typography>
                </Box>
                <Button endIcon={<ArrowForwardIcon />}>View All</Button>
              </Box>
              <List>
                {upcomingTests.map((test, index) => (
                  <Box key={test.title}>
                    <ListItem>
                      <ListItemText
                        primary={test.title}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Chip
                              icon={<CalendarIcon />}
                              label={test.date}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<TimeIcon />}
                              label={test.time}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={test.duration}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                      <Button variant="contained" size="small">
                        Register
                      </Button>
                    </ListItem>
                    {index < upcomingTests.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Practice Problem */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Practice Problem
              </Typography>
              <Typography variant="body1" paragraph>
                Solve today's practice problem to keep your preparation on track.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" fullWidth>
                  Start Practice
                </Button>
                <IconButton color="primary">
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 4,
          bgcolor: 'background.paper',
          borderTop: '1px solid #ececec',
        }}
      >
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              CATrix
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Email: info@catrix.com | Phone: +91-9876543210 | Address: 123, Knowledge Park, Mumbai, India
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Link href="#" color="inherit"><FacebookIcon /></Link>
            <Link href="#" color="inherit"><TwitterIcon /></Link>
            <Link href="#" color="inherit"><InstagramIcon /></Link>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            © {new Date().getFullYear()} CATrix. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 