import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  width: number;
}

export function Sidebar({ open, width }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          transform: open ? 'none' : `translateX(-${width}px)`,
          transition: 'transform 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          visibility: open ? 'visible' : 'hidden',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(122, 162, 247, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontWeight: 500 
                  } 
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
} 