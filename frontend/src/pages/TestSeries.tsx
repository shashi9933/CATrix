import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { testAPI } from '../utils/api';

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  total_questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  section: 'VARC' | 'DILR' | 'QA';
  topics: string[];
  total_marks: number;
  created_at: string;
}

const TestCard = ({
  test,
  onStartTest,
}: {
  test: Test;
  onStartTest: (testId: string) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'VARC':
        return '#6C63FF';
      case 'DILR':
        return '#FF6B6B';
      case 'QA':
        return '#4CAF50';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
            transition: 'all 0.2s ease-in-out',
          },
        }}
        onClick={() => setShowDetails(true)}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography gutterBottom variant="h6" component="h2">
              {test.title}
            </Typography>
            <Chip
              label={test.section}
              size="small"
              sx={{ bgcolor: getSectionColor(test.section), color: 'white' }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {test.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<TimerIcon />}
              label={`${test.duration} mins`}
              size="small"
            />
            <Chip
              icon={<AssignmentIcon />}
              label={`${test.total_questions} questions`}
              size="small"
            />
            <Chip
              label={test.difficulty}
              size="small"
              color={getDifficultyColor(test.difficulty) as any}
            />
            <Chip
              icon={<SchoolIcon />}
              label={`${test.total_marks} marks`}
              size="small"
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onStartTest(test.id);
            }}
          >
            Start Test
          </Button>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>

      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {test.title}
            <Chip
              label={test.section}
              size="small"
              sx={{ bgcolor: getSectionColor(test.section), color: 'white' }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {test.description}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText
                primary="Duration"
                secondary={`${test.duration} minutes`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText
                primary="Questions"
                secondary={`${test.total_questions} questions (${test.total_marks} marks)`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText
                primary="Difficulty"
                secondary={test.difficulty}
              />
            </ListItem>
          </List>
          <Typography variant="subtitle1" gutterBottom>
            Topics Covered
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {test.topics.map((topic) => (
              <Chip key={topic} label={topic} size="small" />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowDetails(false);
              onStartTest(test.id);
            }}
          >
            Start Test
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const subjectWiseChapters = {
  VARC: [
    'Para Jumbles',
    'Para Summary',
    'Sentence Completion',
    'Inferences',
    'Grammar',
    'Fact Inference Judgment',
    'Fill in the Blanks',
    'Para Completion & Inference',
    'Verbal Reasoning',
    'Word Usage (Vocabulary)',
    'Syllogisms',
    'Idioms',
    'Analogies',
    'Reading Comprehension',
    'Sentence Correction',
    'Contextual Usage',
    'Verbal Logic',
    'Antonyms',
    'One-Word Substitution',
    'Different Usage of the Same Word',
  ],
  DILR: [
    'Tables',
    'Graphs',
    'Venn Diagram',
    'Bar Graph',
    'Combination of Graphs',
    'Caselet',
    'Data Sufficiency',
    'Line Graph',
    'Pie Chart',
    'Assumptions',
    'Blood Relations',
    'Binary Logic',
    'Clocks and Calendars',
    'Constraint-based puzzles',
    'Data Arrangement',
    'Family Tree',
    'Matching Puzzles',
    'Propositions',
    'Statements',
    'Seating Arrangement',
    'Sets',
    'Syllogism',
  ],
  QA: [
    'Number System',
    'HCF',
    'LCM',
    'Ratio & Proportion',
    'Simplification',
    'Percentage',
    'Average',
    'Age Calculation',
    'Time & Work',
    'Distances',
    'Theory of Equations',
    'Quadratic Equation',
    'Permutation & Combination',
    'Sequence & Series',
    'Angles',
    'Lines',
    'Triangles',
    'Circles',
    'Areas and Volumes',
    'Rectangles',
    'Squares',
    'Cubes',
    'Cones',
    'Spheres',
    'Pipes and Cistern',
    'Maxima and Minima',
    'Function',
    'Trigonometric Ratios',
    'Heights and Distances',
  ],
};

const fullSubjectTests: Test[] = [
  {
    id: '1',
    title: 'Full VARC Test',
    description: 'Covers all topics in Verbal Ability and Reading Comprehension.',
    duration: 40,
    total_questions: 24,
    difficulty: 'Hard',
    section: 'VARC',
    topics: ['Reading Comprehension', 'Para Jumbles', 'Critical Reasoning'],
    total_marks: 24,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Full DILR Test',
    description: 'Covers all topics in Data Interpretation and Logical Reasoning.',
    duration: 40,
    total_questions: 20,
    difficulty: 'Hard',
    section: 'DILR',
    topics: ['Set Theory', 'Logical Reasoning', 'Data Interpretation'],
    total_marks: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Full QA Test',
    description: 'Covers all topics in Quantitative Aptitude.',
    duration: 40,
    total_questions: 22,
    difficulty: 'Hard',
    section: 'QA',
    topics: ['Algebra', 'Geometry', 'Arithmetic'],
    total_marks: 22,
    created_at: new Date().toISOString(),
  },
];

// Comment out unused test arrays - they'll be loaded from API
// const fullSyllabusTests = [...];
// const yearWiseTests = [...];
// const subjectWiseTests = [...];

const TestSeries = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testAPI.getAll();
      setTests(response.data.tests || fullSubjectTests);
    } catch (err) {
      console.error('Error loading tests:', err);
      // Use default tests as fallback
      setTests(fullSubjectTests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedSubject('');
    setSelectedChapter('');
  };

  const handleSubjectChange = (event: any) => {
    setSelectedSubject(event.target.value);
    setSelectedChapter('');
  };

  const handleChapterChange = (event: any) => {
    setSelectedChapter(event.target.value);
  };

  const handleStartTest = (testId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/test/${testId}`);
  };

  const filteredTests = tests.filter((test) => {
    if (!test) return false;
    const matchesSearch = test.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || test.section === selectedSubject;
    const matchesChapter = !selectedChapter || test.topics?.includes(selectedChapter);
    return matchesSearch && matchesSubject && matchesChapter;
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Series
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Practice with our comprehensive test series to improve your CAT preparation
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search tests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Tests" />
          <Tab label="Subject-wise" />
          <Tab label="Chapter-wise" />
        </Tabs>
      </Box>

      {tabValue === 1 && (
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select Subject</InputLabel>
            <Select
              value={selectedSubject}
              onChange={handleSubjectChange}
              label="Select Subject"
            >
              <MenuItem value="">All Subjects</MenuItem>
              <MenuItem value="VARC">VARC</MenuItem>
              <MenuItem value="DILR">DILR</MenuItem>
              <MenuItem value="QA">QA</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {tabValue === 2 && (
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Subject</InputLabel>
                <Select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  label="Select Subject"
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  <MenuItem value="VARC">VARC</MenuItem>
                  <MenuItem value="DILR">DILR</MenuItem>
                  <MenuItem value="QA">QA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Chapter</InputLabel>
                <Select
                  value={selectedChapter}
                  onChange={handleChapterChange}
                  label="Select Chapter"
                  disabled={!selectedSubject}
                >
                  <MenuItem value="">All Chapters</MenuItem>
                  {selectedSubject &&
                    subjectWiseChapters[selectedSubject as keyof typeof subjectWiseChapters].map(
                      (chapter) => (
                        <MenuItem key={chapter} value={chapter}>
                          {chapter}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography>Loading tests...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minHeight: '200px' }}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" onClick={loadTests}>
            Retry
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.id}>
              <TestCard test={test} onStartTest={handleStartTest} />
            </Grid>
          ))}
          {filteredTests.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minHeight: '200px' }}>
                <Typography align="center" color="text.secondary">
                  No tests found matching your criteria.
                </Typography>
                <Button variant="outlined" onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('');
                  setSelectedChapter('');
                }}>
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default TestSeries; 