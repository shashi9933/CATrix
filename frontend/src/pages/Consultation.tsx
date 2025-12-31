import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
} from '@mui/icons-material';

const Consultation = () => {
  const mentors = [
    {
      name: 'Dr. Rajesh Kumar',
      specialization: 'VARC Expert',
      experience: '15 years',
      rating: '4.9',
      availability: ['Mon', 'Wed', 'Fri'],
    },
    {
      name: 'Prof. Priya Sharma',
      specialization: 'LRDI Expert',
      experience: '12 years',
      rating: '4.8',
      availability: ['Tue', 'Thu', 'Sat'],
    },
    {
      name: 'Dr. Amit Patel',
      specialization: 'Quantitative Aptitude',
      experience: '10 years',
      rating: '4.7',
      availability: ['Mon', 'Tue', 'Wed'],
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Consultation
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Get personalized guidance from experienced mentors
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Mentors
              </Typography>
              <List>
                {mentors.map((mentor, index) => (
                  <Box key={mentor.name}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={mentor.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {mentor.specialization} • {mentor.experience} experience
                            </Typography>
                            <br />
                            <Box sx={{ mt: 1 }}>
                              {mentor.availability.map((day) => (
                                <Chip
                                  key={day}
                                  label={day}
                                  size="small"
                                  sx={{ mr: 0.5 }}
                                />
                              ))}
                            </Box>
                          </>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="primary">
                          Rating: {mentor.rating}/5
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          Schedule
                        </Button>
                      </Box>
                    </ListItem>
                    {index < mentors.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Schedule a Session
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Mentor</InputLabel>
                  <Select label="Select Mentor">
                    {mentors.map((mentor) => (
                      <MenuItem key={mentor.name} value={mentor.name}>
                        {mentor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Time Slot</InputLabel>
                  <Select label="Time Slot">
                    <MenuItem value="10:00">10:00 AM</MenuItem>
                    <MenuItem value="11:00">11:00 AM</MenuItem>
                    <MenuItem value="14:00">2:00 PM</MenuItem>
                    <MenuItem value="15:00">3:00 PM</MenuItem>
                    <MenuItem value="16:00">4:00 PM</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Your Query"
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />

                <Button variant="contained" color="primary" fullWidth>
                  Book Session
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Tips
              </Typography>
              <Typography variant="body2" paragraph>
                • Prepare your questions in advance
                <br />
                • Be specific about your concerns
                <br />
                • Keep your goals in mind
                <br />
                • Take notes during the session
                <br />
                • Follow up on the mentor's suggestions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Consultation; 