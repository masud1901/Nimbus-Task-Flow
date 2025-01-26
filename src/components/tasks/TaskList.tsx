import { useState } from 'react';
import { Box, Typography, IconButton, Checkbox, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Task } from '@/types/database';
import { TodoList } from './TodoList';
import { TodoForm } from './TodoForm';

interface TaskListProps {
  tasks: Task[];
  onAddTodo: (taskId: string) => void;
  onToggleTodo: (todoId: string) => void;
}

export function TaskList({ tasks, onAddTodo, onToggleTodo }: TaskListProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);

  const handleAddTodo = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTodoFormOpen(true);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      fontFamily: 'monospace',
      fontSize: '0.9rem',
    }}>
      {tasks.map((task) => (
        <Box
          key={task.id}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}>
            <Checkbox
              checked={task.completed}
              size="small"
              sx={{ p: 0.5 }}
            />
            <Typography
              sx={{
                flexGrow: 1,
                fontFamily: 'inherit',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
            <Tooltip title="Add todo item">
              <IconButton
                size="small"
                onClick={() => handleAddTodo(task.id)}
                sx={{ p: 0.5 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <TodoList taskId={task.id} onToggle={onToggleTodo} />
        </Box>
      ))}

      {selectedTaskId && (
        <TodoForm
          open={isTodoFormOpen}
          onClose={() => {
            setIsTodoFormOpen(false);
            setSelectedTaskId(null);
          }}
          taskId={selectedTaskId}
        />
      )}
    </Box>
  );
} 