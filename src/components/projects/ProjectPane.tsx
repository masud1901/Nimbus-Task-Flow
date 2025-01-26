import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip, 
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TaskForm } from '@/components/tasks/TaskForm';
import type { Project, Task } from '@/types/database';
import { useStore } from '@/stores/useStore';

interface ProjectPaneProps {
  project: Project;
}

export function ProjectPane({ project }: ProjectPaneProps) {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { tasks, toggleTaskComplete, fetchTasks } = useStore();

  const projectTasks = tasks.filter(task => task.project_id === project.id);
  const today = new Date().toISOString().split('T')[0];
  
  // Group tasks by date
  const tasksByDate = projectTasks.reduce((acc, task) => {
    const date = task.created_at.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  useEffect(() => {
    fetchTasks(project.id);
  }, [project.id, fetchTasks]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          light: 'rgba(247, 118, 142, 0.1)',  // #f7768e
          text: '#f7768e'
        };
      case 'medium':
        return {
          light: 'rgba(224, 175, 104, 0.1)',  // #e0af68
          text: '#e0af68'
        };
      case 'low':
        return {
          light: 'rgba(122, 162, 247, 0.1)',  // #7aa2f7
          text: '#7aa2f7'
        };
      default:
        return {
          light: 'transparent',
          text: '#c0caf5'
        };
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1a1b26',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Project Header */}
      <Box sx={{
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: '#16161e',
        borderBottom: '1px solid #414868',
        zIndex: 2,
      }}>
        <Typography sx={{ 
          fontFamily: 'monospace',
          color: '#7aa2f7',
          fontWeight: 'bold',
        }}>
          {project.name}
        </Typography>
        <Tooltip title="Add task">
          <IconButton 
            size="small" 
            onClick={() => setIsTaskFormOpen(true)}
            sx={{ color: '#7aa2f7' }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Simplified Task List */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          flexGrow: 1,
          bgcolor: 'transparent',
          '& .MuiTableCell-root': {
            borderColor: '#414868',
            fontFamily: 'monospace',
            color: '#c0caf5',
          },
          '& .MuiTableCell-head': {
            bgcolor: '#16161e',
            color: '#7aa2f7',
            fontWeight: 'bold',
          }
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell width={40} sx={{ bgcolor: '#16161e' }}></TableCell>
              <TableCell sx={{ bgcolor: '#16161e' }}>Task</TableCell>
              <TableCell width={100} sx={{ bgcolor: '#16161e' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Today's Tasks */}
            {tasksByDate[today]?.map((task) => (
              <TableRow 
                key={task.id}
                sx={{
                  bgcolor: 'rgba(122, 162, 247, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(122, 162, 247, 0.2)',
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    sx={{
                      color: '#7aa2f7',
                      '&.Mui-checked': {
                        color: '#7aa2f7',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: task.completed ? 'text.secondary' : '#c0caf5',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {task.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: task.completed ? '#9ece6a' : '#7aa2f7',
                      fontSize: '0.75rem',
                    }}
                  >
                    {task.completed ? 'Done' : 'Today'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            {/* Carried Over Tasks */}
            {Object.entries(tasksByDate)
              .filter(([date]) => date < today)
              .flatMap(([date, tasks]) => tasks)
              .map((task) => (
                <TableRow 
                  key={task.id}
                  sx={{
                    bgcolor: 'rgba(247, 118, 142, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(247, 118, 142, 0.2)',
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                      sx={{
                        color: '#f7768e',
                        '&.Mui-checked': {
                          color: '#f7768e',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: task.completed ? 'text.secondary' : '#c0caf5',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {task.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: '#f7768e',
                        fontSize: '0.75rem',
                      }}
                    >
                      Carried Over
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Project Footer */}
      <Box sx={{
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: '#16161e',
        borderTop: '1px solid #414868',
        fontSize: '0.75rem',
        fontFamily: 'monospace',
        zIndex: 2,
      }}>
        <Typography sx={{ color: '#9ece6a' }}>
          {projectTasks.filter(t => t.completed).length} / {projectTasks.length} done
        </Typography>
        <Typography sx={{ color: '#7dcfff' }}>
          {tasksByDate[today]?.length || 0} today
        </Typography>
      </Box>

      <TaskForm
        open={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          fetchTasks(project.id);
        }}
        projectId={project.id}
      />
    </Box>
  );
} 