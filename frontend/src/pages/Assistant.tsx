import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hello! I am your CAT preparation assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        text: input,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInput('');

      // Simulate assistant response
      setTimeout(() => {
        const response: Message = {
          text: 'I understand your question. Let me help you with that...',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, response]);
      }, 1000);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Assistant
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Get instant help with your CAT preparation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 'calc(100vh - 250px)' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                <List>
                  {messages.map((message, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                          maxWidth: '70%',
                        }}
                      >
                        {message.sender === 'assistant' ? (
                          <BotIcon sx={{ mr: 1, color: 'primary.main' }} />
                        ) : (
                          <UserIcon sx={{ ml: 1, color: 'secondary.main' }} />
                        )}
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            backgroundColor:
                              message.sender === 'user' ? 'primary.light' : 'grey.100',
                            color: message.sender === 'user' ? 'white' : 'text.primary',
                          }}
                        >
                          <Typography variant="body1">{message.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Paper>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem button>
                  <ListItemText
                    primary="Generate Study Plan"
                    secondary="Get a personalized study schedule"
                  />
                </ListItem>
                <Divider />
                <ListItem button>
                  <ListItemText
                    primary="Practice Questions"
                    secondary="Get topic-wise practice questions"
                  />
                </ListItem>
                <Divider />
                <ListItem button>
                  <ListItemText
                    primary="Performance Analysis"
                    secondary="Get insights on your test performance"
                  />
                </ListItem>
                <Divider />
                <ListItem button>
                  <ListItemText
                    primary="College Recommendations"
                    secondary="Get personalized college suggestions"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tips for Better Interaction
              </Typography>
              <Typography variant="body2" paragraph>
                • Be specific in your questions
                <br />
                • Ask one question at a time
                <br />
                • Use clear and concise language
                <br />
                • Provide context when needed
                <br />
                • Use the quick actions for common tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Assistant; 