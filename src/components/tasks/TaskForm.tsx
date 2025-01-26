import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box
} from '@mui/material';
import { useStore } from '@stores/useStore';
import { useAuth } from '@contexts/auth/AuthContext';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

export function TaskForm({ open, onClose, projectId }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const { user } = useAuth();
  const { createTask, fetchTasks } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createTask({
        projectId,
        title,
        description,
        dueDate: dueDate || undefined,
        priority,
        remindersEnabled,
        createdBy: user.id
      });
      
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setRemindersEnabled(true);
      
      await fetchTasks(projectId);
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setRemindersEnabled(true);
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1b26',
          color: '#c0caf5',
          '& .MuiDialogTitle-root': {
            color: '#7aa2f7',
          },
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#c0caf5',
                '& fieldset': {
                  borderColor: '#414868',
                },
                '&:hover fieldset': {
                  borderColor: '#7aa2f7',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#7aa2f7',
              },
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="datetime-local"
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
              />
            }
            label="Enable Reminders (6 PM and 11:30 PM)"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={onClose}
            sx={{ color: '#7aa2f7' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              bgcolor: '#7aa2f7',
              '&:hover': {
                bgcolor: '#5d87e6',
              },
            }}
          >
            Add Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 