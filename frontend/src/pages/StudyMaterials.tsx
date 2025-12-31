import { useEffect, useState } from 'react';
import { studyMaterialAPI } from '../utils/api';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Description as PDFIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        const response = await studyMaterialAPI.getAll();
        setMaterials(response.data.materials || []);
      } catch {
        setError('Failed to load study materials.');
      } finally {
        setLoading(false);
      }
    };
    loadMaterials();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Study Materials
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Access comprehensive study materials and external resources for CAT preparation
      </Typography>
      {loading ? (
        <Typography>Loading study materials...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={4}>
          {materials.map((material) => (
            <Grid item xs={12} md={6} key={material.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{material.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>{material.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      href={material.url}
                      target="_blank"
                      rel="noopener"
                      startIcon={material.type === 'internal' ? <PDFIcon /> : <LinkIcon />}
                    >
                      {material.type === 'internal' ? 'Download' : 'Visit'}
                    </Button>
                    {material.subject && <Button size="small" disabled>{material.subject}</Button>}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StudyMaterials; 