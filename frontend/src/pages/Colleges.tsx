import { useEffect, useState } from 'react';
import { collegeAPI } from '../utils/api';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Colleges = () => {
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    collegeAPI.getAll()
      .then((response: any) => {
        setColleges(response.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load colleges.');
        setLoading(false);
      });
  }, []);

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        B-Schools
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Explore top B-schools and find the best fit for your career goals
      </Typography>
      {loading ? (
        <Typography>Loading colleges...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search colleges..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>College Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Expected Cutoff</TableCell>
                        <TableCell>Fees</TableCell>
                        <TableCell>Average Placement</TableCell>
                        <TableCell>Specializations</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredColleges.map((college) => (
                        <TableRow key={college.id}>
                          <TableCell>{college.name}</TableCell>
                          <TableCell>{college.location}</TableCell>
                          <TableCell>{college.cutoff}%</TableCell>
                          <TableCell>{college.fees}</TableCell>
                          <TableCell>{college.placement}</TableCell>
                          <TableCell>
                            {Array.isArray(college.specializations)
                              ? college.specializations.map((spec: string) => (
                                  <Chip key={spec} label={spec} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                ))
                              : null}
                          </TableCell>
                          <TableCell>
                            <Button size="small" color="primary" href={college.website} target="_blank" rel="noopener">
                              Visit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  College Predictor
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Enter your expected CAT score to see which colleges you might be eligible for
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    label="Expected Percentile"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                  <Button variant="contained" color="primary">
                    Predict Colleges
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Admission Tips
                </Typography>
                <Typography variant="body2" paragraph>
                  • Start preparing for GD/PI well in advance
                  <br />
                  • Keep track of important dates and deadlines
                  <br />
                  • Prepare a strong Statement of Purpose
                  <br />
                  • Gather all required documents beforehand
                  <br />
                  • Research about the college and its culture
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Colleges; 