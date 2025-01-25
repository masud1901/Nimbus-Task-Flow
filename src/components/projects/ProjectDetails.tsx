import { useState, useEffect } from 'react';
import { Box, Typography, Button, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useStore } from '@stores/useStore';
import { TaskList } from '@components/tasks/TaskList';
import { TaskForm } from '@components/tasks/TaskForm';

export function ProjectDetails() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { id } = useParams();
  const { tasks, loading, fetchTasks, toggleTaskComplete } = useStore();

  useEffect(() => {
    if (id) {
      fetchTasks(id);
    }
  }, [id, fetchTasks]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>

      {loading ? (
        <Typography>Loading tasks...</Typography>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleTaskComplete}
        />
      )}

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
        onClick={() => setIsTaskFormOpen(true)}
      >
        <AddIcon />
      </Fab>

      {id && (
        <TaskForm
          open={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          projectId={id}
        />
      )}
    </Box>
  );
} 