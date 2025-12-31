import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Flag as FlagIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { testAPI, testAttemptAPI } from '../utils/api';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  correct_answer: string;
  marks: number;
  section: string;
  options?: {
    id: string;
    option_text: string;
    option_letter: string;
  }[];
}

interface Test {
  id: string;
  name: string;
  duration_minutes: number;
  total_questions: number;
  total_marks: number;
}

const TestAttempt = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testAttemptId, setTestAttemptId] = useState<string | null>(null);

  useEffect(() => {
    const loadTest = async () => {
      if (!testId) {
        setError('Test ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await testAPI.getById(testId);
        const testData = response.data;
        
        if (!testData) {
          throw new Error('Test data not found');
        }

        // Create a new test attempt
        const attemptResponse = await testAPI.createAttempt(testId);
        setTestAttemptId(attemptResponse.data.id);

        setTest(testData);
        setQuestions(testData.questions || []);
        setTimeLeft((testData.duration_minutes || 60) * 60);
        setLoading(false);
      } catch (err) {
        console.error('Error loading test:', err);
        setError('Failed to load test. Please try again.');
        setLoading(false);
      }
    };
    loadTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft <= 0 && testAttemptId) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, testAttemptId]);

  const handleAnswerSelect = async (questionId: string, answer: string) => {
    if (!testAttemptId) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    try {
      // Record the question attempt
      await testAPI.recordAnswer(testAttemptId, questionId, answer);
    } catch (err) {
      console.error('Error recording answer:', err);
    }
  };

  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((question) => {
      const userAnswer = selectedAnswers[(question as any).id];
      if (userAnswer === question.correct_answer) {
        totalScore += question.marks;
      }
      maxScore += question.marks;
    });

    return {
      score: totalScore,
      maxScore: maxScore,
      percentage: (totalScore / maxScore) * 100,
    };
  };

  const handleSubmit = async () => {
    if (!testAttemptId) return;

    try {
      const score = calculateScore();
      
      // Update test attempt with final score and status
      await testAttemptAPI.update(testAttemptId, {
        completed_at: new Date().toISOString(),
        score: score.score,
        status: 'completed',
      });

      setShowSubmitDialog(false);
      navigate('/analytics');
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading test...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Test not found.</Typography>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{test.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<TimerIcon />}
            label={formatTime(timeLeft)}
            color={timeLeft < 300 ? 'error' : 'primary'}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowSubmitDialog(true)}
          >
            Submit Test
          </Button>
        </Box>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 3, height: 8, borderRadius: 4 }}
      />

      {/* Question Navigation */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {questions.map((_, index) => (
          <Chip
            key={index}
            label={index + 1}
            onClick={() => setCurrentQuestionIndex(index)}
            color={
              selectedAnswers[questions[index].id]
                ? 'primary'
                : flaggedQuestions.has(questions[index].id)
                ? 'warning'
                : 'default'
            }
            variant={currentQuestionIndex === index ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      {/* Current Question */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <IconButton
              onClick={() => handleFlagQuestion(currentQuestion.id)}
              color={flaggedQuestions.has(currentQuestion.id) ? 'warning' : 'default'}
            >
              <FlagIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {currentQuestion.question_text}
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup
              value={selectedAnswers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
            >
              {currentQuestion.options?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.option_letter}
                  control={<Radio />}
                  label={option.option_text}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<PrevIcon />}
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          endIcon={<NextIcon />}
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </Button>
      </Box>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Test</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit the test? You have answered{' '}
            {Object.keys(selectedAnswers).length} out of {questions.length} questions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestAttempt; 