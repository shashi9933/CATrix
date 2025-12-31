import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Link,
} from '@mui/material';
import {
  MenuBook as BookIcon,
  Newspaper as NewspaperIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Public as PublicIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resources-tabpanel-${index}`}
      aria-labelledby={`resources-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ResourceCard = ({
  title,
  description,
  link,
  icon,
  category,
}: {
  title: string;
  description: string;
  link?: string;
  icon: React.ReactNode;
  category: string;
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label={category} size="small" />
        {link && (
          <Link href={link} target="_blank" rel="noopener">
            <Chip label="Visit" size="small" color="primary" clickable />
          </Link>
        )}
      </Box>
    </CardContent>
  </Card>
);

const Resources = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const readingResources = [
    {
      title: 'Smithsonian Magazine',
      description: 'Magazine covering history, science, arts, and culture.',
      link: 'https://www.smithsonianmag.com',
      icon: <NewspaperIcon color="primary" />,
      category: 'Magazine',
    },
    {
      title: 'Big Think',
      description: 'Ideas platform featuring expert-driven content on science, philosophy, and culture.',
      link: 'https://bigthink.com',
      icon: <BookIcon color="primary" />,
      category: 'Ideas Platform',
    },
    {
      title: 'Freethink',
      description: 'Innovation media platform sharing stories of people and ideas changing the world.',
      link: 'https://www.freethink.com',
      icon: <BookIcon color="primary" />,
      category: 'Innovation Media',
    },
    {
      title: 'Arts & Letters Daily',
      description: 'Aggregator of essays, reviews, and opinion pieces on literature, philosophy, and culture.',
      link: 'https://www.aldaily.com',
      icon: <BookIcon color="primary" />,
      category: 'Essays/Aggregator',
    },
    {
      title: 'The Economist',
      description: 'Essential for VARC preparation. Excellent for reading comprehension and current affairs.',
      link: 'https://www.economist.com',
      icon: <NewspaperIcon color="primary" />,
      category: 'Magazine',
    },
    {
      title: 'The Guardian',
      description: 'International newspaper with in-depth news and analysis.',
      link: 'https://www.theguardian.com',
      icon: <NewspaperIcon color="primary" />,
      category: 'Newspaper',
    },
    {
      title: 'New York Times',
      description: 'Excellent source for diverse reading material and current affairs.',
      link: 'https://www.nytimes.com',
      icon: <NewspaperIcon color="primary" />,
      category: 'Newspaper',
    },
    {
      title: 'The Atlantic',
      description: 'Magazine covering news, politics, culture, technology, and health.',
      link: 'https://www.theatlantic.com',
      icon: <NewspaperIcon color="primary" />,
      category: 'Magazine',
    },
    {
      title: 'Prospect Magazine',
      description: 'Current affairs and political analysis.',
      link: 'https://www.prospectmagazine.co.uk',
      icon: <NewspaperIcon color="primary" />,
      category: 'Magazine',
    },
    {
      title: 'Time Magazine',
      description: 'Magazine covering world news, politics, and culture.',
      link: 'https://time.com',
      icon: <NewspaperIcon color="primary" />,
      category: 'Magazine',
    },
    {
      title: 'Aeon Essays',
      description: 'Essays on philosophy, culture, and society.',
      link: 'https://aeon.co/essays',
      icon: <BookIcon color="primary" />,
      category: 'Essays',
    },
    {
      title: 'Washington Post',
      description: 'Quality journalism for reading comprehension practice.',
      link: 'https://www.washingtonpost.com',
      icon: <NewspaperIcon color="primary" />,
      category: 'Newspaper',
    },
  ];

  const academicResources = [
    {
      title: 'The Conversation',
      description: 'Academic commentary on current events and social issues.',
      link: 'https://theconversation.com',
      icon: <PublicIcon color="primary" />,
      category: 'Academic Journalism',
    },
    {
      title: 'Noba Project',
      description: 'Open-access scientific journal for psychology and related fields.',
      link: 'https://nobaproject.com',
      icon: <ScienceIcon color="primary" />,
      category: 'Scientific Journal',
    },
    {
      title: 'Springer',
      description: 'Leading global scientific publisher.',
      link: 'https://www.springer.com',
      icon: <SchoolIcon color="primary" />,
      category: 'Scientific Publisher',
    },
    {
      title: 'E.H. Carr - What is History?',
      description: 'Classic book on historiography and the philosophy of history.',
      link: 'https://archive.org/details/in.ernet.dli.2015.187491',
      icon: <BookIcon color="primary" />,
      category: 'Book',
    },
  ];

  const currentAffairs = [
    {
      title: 'BBC',
      description: 'Trusted news website for global current affairs.',
      link: 'https://www.bbc.com',
      icon: <PublicIcon color="primary" />,
      category: 'News Website',
    },
  ];

  const studyTopics = [
    {
      title: 'Historical Analysis',
      description: 'Resources for understanding historical contexts and analysis.',
      icon: <HistoryIcon color="primary" />,
      category: 'Topic',
    },
    {
      title: 'Social Sciences',
      description: 'Materials covering sociology, anthropology, and cultural studies.',
      icon: <PsychologyIcon color="primary" />,
      category: 'Topic',
    },
    {
      title: 'Environmental Studies',
      description: 'Resources on environmental issues and climate change.',
      icon: <PublicIcon color="primary" />,
      category: 'Topic',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Learning Resources
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Comprehensive collection of resources to enhance your CAT preparation
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Reading Practice" />
          <Tab label="Academic Resources" />
          <Tab label="Current Affairs" />
          <Tab label="Study Topics" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {readingResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.title}>
              <ResourceCard {...resource} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {academicResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.title}>
              <ResourceCard {...resource} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {currentAffairs.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.title}>
              <ResourceCard {...resource} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {studyTopics.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.title}>
              <ResourceCard {...resource} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Resources; 