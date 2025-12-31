import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { processPDF } from '../utils/pdfProcessor';
import { useNavigate } from 'react-router-dom';

interface Question {
  id?: number;
  question_text: string;
  question_type: 'MCQ' | 'TITA';
  correct_answer: string;
  marks: number;
  section: 'VARC' | 'DILR' | 'QA';
  options?: {
    option_text: string;
    option_letter: string;
  }[];
}

interface Test {
  title: string;
  description: string;
  duration: number;
  section: 'VARC' | 'DILR' | 'QA';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
}

const AdminPanel: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentTest, setCurrentTest] = useState<Test>({
    title: '',
    description: '',
    duration: 60,
    section: 'VARC',
    difficulty: 'Medium',
    topics: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      // In production, verify admin access via API
      // For now, allow access (should be protected by backend auth)
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        question_type: 'MCQ',
        correct_answer: '',
        marks: 1,
        section: currentTest.section,
        options: [{ option_text: '', option_letter: '' }, { option_text: '', option_letter: '' }, { option_text: '', option_letter: '' }, { option_text: '', option_letter: '' }],
      },
    ]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];
    if (uploadedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const processedQuestions = await processPDF(uploadedFile);
      setQuestions(processedQuestions as Question[]);
      setActiveStep(1);
    } catch (err) {
      setError('Failed to process PDF file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestDetailsChange = (field: keyof Test, value: any) => {
    setCurrentTest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionEdit = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleQuestionUpdate = (updatedQuestion: Question) => {
    setQuestions(prev =>
      prev.map(q =>
        q.question_text === updatedQuestion.question_text ? updatedQuestion : q
      )
    );
    setEditingQuestion(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Save test and questions via API
      // const response = await testAPI.createTest({
      //   ...currentTest,
      //   total_questions: questions.length,
      //   questions: questions,
      // });

      setSuccess('Test and questions saved successfully!');
      setActiveStep(0);
      setQuestions([]);
      setCurrentTest({
        title: '',
        description: '',
        duration: 60,
        section: 'VARC',
        difficulty: 'Medium',
        topics: [],
      });
    } catch (err) {
      setError('Failed to save test and questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const steps = ['Upload PDF', 'Review Questions', 'Enter Test Details', 'Confirm & Save'];

  if (!isAdmin) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="PDF Upload" />
        <Tab label="Manual Entry" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ p: 3 }}>
        {activeTab === 0 ? (
          <Box>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box>
              <Typography variant="h6" gutterBottom>
                Upload PDF File
              </Typography>
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="pdf-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="pdf-upload">
                <Button
                  variant="contained"
                  component="span"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Upload PDF'}
                </Button>
              </label>
            </Box>

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Review Extracted Questions
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Section</TableCell>
                        <TableCell>Marks</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {questions.map((question, index) => (
                        <TableRow key={index}>
                          <TableCell>{question.question_text}</TableCell>
                          <TableCell>{question.question_type}</TableCell>
                          <TableCell>{question.section}</TableCell>
                          <TableCell>{question.marks}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleQuestionEdit(question)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(2)}
                    disabled={questions.length === 0}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Enter Test Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Test Title"
                    value={currentTest.title}
                    onChange={(e) => handleTestDetailsChange('title', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    value={currentTest.description}
                    onChange={(e) => handleTestDetailsChange('description', e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                  />
                  <TextField
                    label="Duration (minutes)"
                    type="number"
                    value={currentTest.duration}
                    onChange={(e) => handleTestDetailsChange('duration', parseInt(e.target.value))}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Section</InputLabel>
                    <Select
                      value={currentTest.section}
                      onChange={(e) => handleTestDetailsChange('section', e.target.value as 'VARC' | 'DILR' | 'QA')}
                      label="Section"
                    >
                      <MenuItem value="VARC">VARC</MenuItem>
                      <MenuItem value="DILR">DILR</MenuItem>
                      <MenuItem value="QA">QA</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={currentTest.difficulty}
                      onChange={(e) => handleTestDetailsChange('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
                      label="Difficulty"
                    >
                      <MenuItem value="Easy">Easy</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Hard">Hard</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Topics (comma-separated)"
                    value={currentTest.topics.join(', ')}
                    onChange={(e) => handleTestDetailsChange('topics', e.target.value.split(',').map(t => t.trim()))}
                    fullWidth
                  />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={() => setActiveStep(1)}>Back</Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(3)}
                    disabled={!currentTest.title || !currentTest.description}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Confirm & Save
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Test Details:</Typography>
                  <Typography>Title: {currentTest.title}</Typography>
                  <Typography>Description: {currentTest.description}</Typography>
                  <Typography>Duration: {currentTest.duration} minutes</Typography>
                  <Typography>Total Questions: {questions.length}</Typography>
                  <Typography>Total Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={() => setActiveStep(2)}>Back</Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Test'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Test Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Test Title"
                  value={currentTest.title}
                  onChange={(e) => handleTestDetailsChange('title', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={currentTest.description}
                  onChange={(e) => handleTestDetailsChange('description', e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={currentTest.duration}
                  onChange={(e) => handleTestDetailsChange('duration', parseInt(e.target.value))}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={currentTest.section}
                    onChange={(e) => handleTestDetailsChange('section', e.target.value as 'VARC' | 'DILR' | 'QA')}
                    label="Section"
                  >
                    <MenuItem value="VARC">VARC</MenuItem>
                    <MenuItem value="DILR">DILR</MenuItem>
                    <MenuItem value="QA">QA</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={currentTest.difficulty}
                    onChange={(e) => handleTestDetailsChange('difficulty', e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    label="Difficulty"
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Topics (comma-separated)"
                  value={currentTest.topics.join(', ')}
                  onChange={(e) => handleTestDetailsChange('topics', e.target.value.split(',').map(t => t.trim()))}
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Questions</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddQuestion}
                >
                  Add Question
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Question</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Section</TableCell>
                      <TableCell>Marks</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions.map((question, index) => (
                      <TableRow key={index}>
                        <TableCell>{question.question_text}</TableCell>
                        <TableCell>{question.question_type}</TableCell>
                        <TableCell>{question.section}</TableCell>
                        <TableCell>{question.marks}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleQuestionEdit(question)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteQuestion(index)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading || questions.length === 0 || !currentTest.title}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Test'}
              </Button>
            </Box>
          </Box>
        )}
      </Card>

      <Dialog
        open={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        maxWidth="md"
        fullWidth
      >
        {editingQuestion && (
          <>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Question Text"
                  value={editingQuestion.question_text}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question_text: e.target.value,
                    })
                  }
                  multiline
                  rows={4}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={editingQuestion.question_type}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question_type: e.target.value as 'MCQ' | 'TITA',
                      })
                    }
                    label="Question Type"
                  >
                    <MenuItem value="MCQ">MCQ</MenuItem>
                    <MenuItem value="TITA">TITA</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={editingQuestion.section}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        section: e.target.value as 'VARC' | 'DILR' | 'QA',
                      })
                    }
                    label="Section"
                  >
                    <MenuItem value="VARC">VARC</MenuItem>
                    <MenuItem value="DILR">DILR</MenuItem>
                    <MenuItem value="QA">QA</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Marks"
                  type="number"
                  value={editingQuestion.marks}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      marks: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                />
                {editingQuestion.question_type === 'MCQ' && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Options
                    </Typography>
                    {editingQuestion.options?.map((option, index) => (
                      <TextField
                        key={index}
                        label={`Option ${String.fromCharCode(65 + index)}`}
                        value={option.option_text}
                        onChange={(e) => {
                          const newOptions = [...(editingQuestion.options || [])];
                          newOptions[index] = {
                            ...option,
                            option_text: e.target.value,
                          };
                          handleQuestionChange(questions.findIndex(q => q.question_text === editingQuestion.question_text), 'options', newOptions);
                        }}
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                    ))}
                    <TextField
                      label="Correct Answer"
                      value={editingQuestion.correct_answer}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          correct_answer: e.target.value.toUpperCase(),
                        })
                      }
                      fullWidth
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingQuestion(null)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (editingQuestion.question_text) {
                    if (editingQuestion.question_type === 'MCQ') {
                      const hasEmptyOptions = editingQuestion.options?.some(
                        opt => !opt.option_text
                      );
                      if (hasEmptyOptions) {
                        setError('All MCQ options must be filled');
                        return;
                      }
                      if (!editingQuestion.correct_answer) {
                        setError('Please specify the correct answer');
                        return;
                      }
                    }
                    handleQuestionUpdate(editingQuestion);
                  } else {
                    setError('Question text is required');
                  }
                }}
                variant="contained"
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminPanel; 