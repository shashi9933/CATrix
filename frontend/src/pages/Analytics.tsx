import { useEffect, useState } from 'react';
import { analyticsAPI } from '../utils/api';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface TestResult {
  id: string;
  test_id: string;
  score: number;
  completed_at: string;
  tests: {
    name: string;
    total_marks: number;
  };
  question_attempts: {
    is_correct: boolean;
    time_taken_seconds: number;
    question: {
      section: string;
      marks: number;
    };
  }[];
}

const Analytics = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getUserAnalytics();
        setTestResults(response.data.results || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const calculateSectionPerformance = (tests: TestResult[]) => {
    const sections = ['VARC', 'DILR', 'QA'];
    return sections.map(section => {
      const sectionTests = tests.filter(test => 
        test.question_attempts.some(qa => qa.question.section === section)
      );
      
      const totalMarks = sectionTests.reduce((acc, test) => {
        const sectionQuestions = test.question_attempts.filter(
          qa => qa.question.section === section
        );
        return acc + sectionQuestions.reduce((sum, q) => sum + q.question.marks, 0);
      }, 0);

      const earnedMarks = sectionTests.reduce((acc, test) => {
        const sectionQuestions = test.question_attempts.filter(
          qa => qa.question.section === section && qa.is_correct
        );
        return acc + sectionQuestions.reduce((sum, q) => sum + q.question.marks, 0);
      }, 0);

      return {
        section,
        score: totalMarks ? (earnedMarks / totalMarks) * 100 : 0,
        target: section === 'DILR' ? 80 : 85,
        color: section === 'VARC' ? '#6C63FF' : section === 'DILR' ? '#FF6B6B' : '#4CAF50',
      };
    });
  };

  const calculateWeakTopics = (tests: TestResult[]) => {
    const topicPerformance = new Map<string, { correct: number; total: number }>();
    
    tests.forEach(test => {
      test.question_attempts.forEach(qa => {
        const topic = qa.question.section;
        const current = topicPerformance.get(topic) || { correct: 0, total: 0 };
        topicPerformance.set(topic, {
          correct: current.correct + (qa.is_correct ? 1 : 0),
          total: current.total + 1,
        });
      });
    });

    return Array.from(topicPerformance.entries())
      .map(([topic, { correct, total }]) => ({
        topic,
        accuracy: (correct / total) * 100,
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
  };

  const sectionPerformance = calculateSectionPerformance(testResults);
  const weakTopics = calculateWeakTopics(testResults);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Performance Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Track your progress and identify areas for improvement
      </Typography>
      {loading ? (
        <Typography>Loading analytics...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Section-wise Performance
                </Typography>
                {sectionPerformance.map((section) => (
                  <Box key={section.section} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{section.section}</Typography>
                      <Typography variant="body2">
                        {section.score.toFixed(1)}% / {section.target}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={section.target ? (section.score / section.target) * 100 : 0}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: section.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Test Performance
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Test</TableCell>
                        <TableCell align="right">Score</TableCell>
                        <TableCell align="right">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testResults.map((test: any) => (
                        <TableRow key={test.id}>
                          <TableCell>{test.tests?.name}</TableCell>
                          <TableCell align="right">
                            {test.score} / {test.tests?.total_marks}
                          </TableCell>
                          <TableCell align="right">
                            {new Date(test.completed_at).toLocaleDateString()}
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
                  Areas for Improvement
                </Typography>
                <Grid container spacing={2}>
                  {weakTopics.map(({ topic, accuracy }) => (
                    <Grid item xs={12} md={4} key={topic}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                              {topic}
                            </Typography>
                            <Chip
                              icon={accuracy < 60 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                              label={`${accuracy.toFixed(1)}%`}
                              color={accuracy < 60 ? 'error' : 'success'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {accuracy < 60
                              ? 'Focus on improving this area'
                              : 'Good progress, keep practicing'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Analytics; 