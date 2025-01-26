import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, TextField, InputAdornment, Button } from '@mui/material';
import { 
  Add as AddIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewModule as ViewModuleIcon,
  DragIndicator as DragIcon,
  AddBox as AddProjectIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useStore } from '@stores/useStore';
import { CreateProjectDialog } from '@components/projects/CreateProjectDialog';
import { ProjectPane } from '@components/projects/ProjectPane';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'single' | 'split' | 'grid';
type PaneConfig = {
  id: string;
  type: 'project';
  size?: number; // Size in grid units
  position?: { x: number; y: number };
};

export function Dashboard() {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [paneConfigs, setPaneConfigs] = useState<PaneConfig[]>([]);
  const [quickTask, setQuickTask] = useState('');
  const { projects, loading, fetchProjects, createTask } = useStore();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Update pane configurations when projects change
  useEffect(() => {
    const newConfigs = projects.map(project => ({
      id: project.id,
      type: 'project' as const,
      size: 1,
    }));
    setPaneConfigs(newConfigs);
  }, [projects]);

  // Automatically adjust view mode based on pane count
  useEffect(() => {
    if (paneConfigs.length === 1) setViewMode('single');
    else if (paneConfigs.length === 2) setViewMode('split');
    else if (paneConfigs.length >= 3) setViewMode('grid');
  }, [paneConfigs.length]);

  const getGridLayout = () => {
    switch (viewMode) {
      case 'single':
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr'
        };
      case 'split':
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr'
        };
      case 'grid':
        return {
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gridTemplateRows: 'auto'
        };
      default:
        return {};
    }
  };

  const handlePaneDragStart = (e: React.DragEvent, paneId: string) => {
    e.dataTransfer.setData('paneId', paneId);
  };

  const handlePaneDrop = (e: React.DragEvent, targetPaneId: string) => {
    const draggedPaneId = e.dataTransfer.getData('paneId');
    if (draggedPaneId === targetPaneId) return;

    setPaneConfigs(prev => {
      const newConfigs = [...prev];
      const draggedIndex = newConfigs.findIndex(p => p.id === draggedPaneId);
      const targetIndex = newConfigs.findIndex(p => p.id === targetPaneId);
      
      const [draggedPane] = newConfigs.splice(draggedIndex, 1);
      newConfigs.splice(targetIndex, 0, draggedPane);
      
      return newConfigs;
    });
  };

  const handleQuickTaskCreate = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && quickTask.trim() && projects.length > 0) {
      try {
        await createTask({
          projectId: projects[0].id, // Add to first project by default
          title: quickTask,
          priority: 'medium',
          createdBy: user?.id || '',
          dueDate: new Date().toISOString(), // Today's date
        });
        setQuickTask('');
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#1a1b26',
      color: '#c0caf5',
    }}>
      {/* Command Bar - removed animations, added glow effects */}
      <Box sx={{ 
        height: '32px',
        bgcolor: '#16161e',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        borderBottom: '1px solid #414868',
      }}>
        <Typography sx={{ 
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: '#7aa2f7',
        }}>
          [TaskFlow]
        </Typography>

        {/* Quick Task Input with glow effect */}
        <TextField
          size="small"
          placeholder="Add task for today (Press Enter)"
          value={quickTask}
          onChange={(e) => setQuickTask(e.target.value)}
          onKeyPress={handleQuickTaskCreate}
          sx={{
            flexGrow: 1,
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              height: '24px',
              fontSize: '0.875rem',
              backgroundColor: 'rgba(26, 27, 38, 0.6)',
              '& fieldset': {
                borderColor: '#414868',
                transition: 'box-shadow 0.2s ease-in-out',
              },
              '&:hover fieldset': {
                borderColor: '#7aa2f7',
                boxShadow: '0 0 10px rgba(122, 162, 247, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#7aa2f7',
                boxShadow: '0 0 15px rgba(122, 162, 247, 0.3)',
              },
            },
            '& .MuiOutlinedInput-input': {
              padding: '4px 8px',
              color: '#c0caf5',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AddIcon sx={{ fontSize: '0.875rem', color: '#7aa2f7' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Command buttons with glow effects */}
        <Tooltip title="New Project">
          <IconButton
            size="small"
            onClick={() => setIsProjectDialogOpen(true)}
            sx={{
              color: '#9ece6a',
              transition: 'box-shadow 0.2s ease-in-out',
              '&:hover': {
                color: '#b9f27c',
                bgcolor: 'transparent',
                boxShadow: '0 0 15px rgba(158, 206, 106, 0.4)',
              },
            }}
          >
            <AddProjectIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* View Mode Controls with glow effects */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Single View">
            <IconButton 
              size="small" 
              onClick={() => setViewMode('single')}
              sx={{ 
                color: viewMode === 'single' ? '#7aa2f7' : '#565f89',
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': {
                  color: '#7aa2f7',
                  bgcolor: 'transparent',
                  boxShadow: '0 0 15px rgba(122, 162, 247, 0.3)',
                }
              }}
            >
              <ViewDayIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Split View">
            <IconButton 
              size="small" 
              onClick={() => setViewMode('split')}
              sx={{ 
                color: viewMode === 'split' ? '#7aa2f7' : '#565f89',
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': {
                  color: '#7aa2f7',
                  bgcolor: 'transparent',
                  boxShadow: '0 0 15px rgba(122, 162, 247, 0.3)',
                }
              }}
            >
              <ViewWeekIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grid View">
            <IconButton 
              size="small" 
              onClick={() => setViewMode('grid')}
              sx={{ 
                color: viewMode === 'grid' ? '#7aa2f7' : '#565f89',
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': {
                  color: '#7aa2f7',
                  bgcolor: 'transparent',
                  boxShadow: '0 0 15px rgba(122, 162, 247, 0.3)',
                }
              }}
            >
              <ViewModuleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button with glow effect */}
        <Tooltip title="Logout">
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{
              color: '#f7768e',
              transition: 'box-shadow 0.2s ease-in-out',
              '&:hover': {
                color: '#ff8b98',
                bgcolor: 'transparent',
                boxShadow: '0 0 15px rgba(247, 118, 142, 0.4)',
              },
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Content Area - removed animations, added glow effects */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'grid',
        ...getGridLayout(),
        gap: '1px',
        bgcolor: '#24283b',
        overflow: 'hidden',
        p: '1px',
      }}>
        {paneConfigs.map((config) => {
          const project = projects.find(p => p.id === config.id);
          if (!project) return null;

          return (
            <Box
              key={config.id}
              draggable
              onDragStart={(e) => handlePaneDragStart(e, config.id)}
              onDrop={(e) => handlePaneDrop(e, config.id)}
              onDragOver={(e) => e.preventDefault()}
              sx={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 0 20px rgba(122, 162, 247, 0.2)',
                  '& .drag-handle': {
                    opacity: 1,
                  },
                },
              }}
            >
              <IconButton
                className="drag-handle"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                  zIndex: 1,
                  color: '#7aa2f7',
                  backdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(26, 27, 38, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 27, 38, 0.7)',
                    boxShadow: '0 0 15px rgba(122, 162, 247, 0.3)',
                  },
                }}
              >
                <DragIcon />
              </IconButton>
              <ProjectPane project={project} />
            </Box>
          );
        })}

        {/* Empty state - removed animations, added glow effect */}
        {paneConfigs.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              color: '#7aa2f7',
              fontFamily: 'monospace',
              cursor: 'pointer',
              height: '100%',
              borderRadius: '12px',
              transition: 'box-shadow 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'rgba(47, 53, 77, 0.5)',
                boxShadow: '0 0 30px rgba(122, 162, 247, 0.3)',
              },
            }}
            onClick={() => setIsProjectDialogOpen(true)}
          >
            <AddProjectIcon sx={{ fontSize: 48 }} />
            <Typography>Create your first project</Typography>
          </Box>
        )}
      </Box>

      {/* Project Dialog */}
      <CreateProjectDialog 
        open={isProjectDialogOpen} 
        onClose={() => setIsProjectDialogOpen(false)} 
      />
    </Box>
  );
}