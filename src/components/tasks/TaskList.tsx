import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Checkbox,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { Task } from '@/types/database';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
}

export function TaskList({ tasks, onToggleComplete, onDelete, onEdit }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 3,
      p: 3,
    }}>
      {tasks.map((task) => (
        <Fade in key={task.id}>
          <Card
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Checkbox
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                sx={{ mt: -0.5 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {task.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {task.description}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip
                size="small"
                label={task.priority}
                color={getPriorityColor(task.priority)}
              />
              {task.due_date && (
                <Chip
                  size="small"
                  icon={<TimeIcon />}
                  label={new Date(task.due_date).toLocaleDateString()}
                />
              )}
            </Stack>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: 1,
              mt: 2 
            }}>
              {onEdit && (
                <IconButton 
                  size="small" 
                  onClick={() => onEdit(task)}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton 
                  size="small" 
                  onClick={() => onDelete(task.id)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Card>
        </Fade>
      ))}
    </Box>
  );
} 