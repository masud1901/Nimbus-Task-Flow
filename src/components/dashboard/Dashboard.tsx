import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Avatar, AvatarGroup, Divider } from '@mui/material';
import { Add as AddIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useStore } from '@stores/useStore';
import { CreateProjectDialog } from '@components/projects/CreateProjectDialog';
import { TaskList } from '@components/tasks/TaskList';

export function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { projects, tasks, loading, fetchProjects } = useStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: 2,
      height: 'calc(100vh - 100px)',
      overflow: 'hidden',
    }}>
      {projects.map((project) => (
        <Box
          key={project.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          {/* Project Header */}
          <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {project.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Project menu">
                <IconButton size="small">
                  <MenuIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Project Content (Tasks) */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            p: 2,
          }}>
            <TaskList
              tasks={tasks.filter(task => task.project_id === project.id)}
              onToggleComplete={() => {}}
            />
          </Box>

          {/* Project Footer */}
          <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}>
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
              <Avatar alt="User 1" src="/path-to-avatar-1" />
              <Avatar alt="User 2" src="/path-to-avatar-2" />
            </AvatarGroup>
            <Tooltip title="Add task">
              <IconButton size="small" color="primary">
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}

      {/* Add Project Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          cursor: 'pointer',
          height: '100%',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'background.paper',
          },
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        <Tooltip title="Create new project">
          <AddIcon color="primary" sx={{ fontSize: 40 }} />
        </Tooltip>
      </Box>

      <CreateProjectDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </Box>
  );
}