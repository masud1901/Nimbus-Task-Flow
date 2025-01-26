import { useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Chip,
  Box,
} from '@mui/material';
import {
  FlagOutlined as FlagIcon,
} from '@mui/icons-material';
import { useStore } from '@/stores/useStore';

interface TodoListProps {
  taskId: string;
  onToggle: (todoId: string) => void;
}

export function TodoList({ taskId, onToggle }: TodoListProps) {
  const { todos, fetchTodos } = useStore();

  useEffect(() => {
    fetchTodos(taskId);
  }, [taskId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f7768e'; // Red
      case 'medium':
        return '#e0af68'; // Yellow
      case 'low':
        return '#7aa2f7'; // Blue
      default:
        return '#565f89'; // Gray
    }
  };

  return (
    <List sx={{ py: 0 }}>
      {todos
        .filter(todo => todo.task_id === taskId)
        .sort((a, b) => a.order_index - b.order_index)
        .map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              py: 0.5,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(122, 162, 247, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Checkbox
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                size="small"
              />
            </ListItemIcon>
            <ListItemText
              primary={todo.content}
              sx={{
                '& .MuiTypography-root': {
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlagIcon sx={{ 
                fontSize: '1rem',
                color: getPriorityColor(todo.priority)
              }} />
            </Box>
          </ListItem>
        ))}
    </List>
  );
} 