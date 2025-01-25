import { Card, CardContent, CardHeader, CardActions, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/types/database';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        title={project.name}
        subheader={new Date(project.created_at).toLocaleDateString()}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {project.description || 'No description'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
} 