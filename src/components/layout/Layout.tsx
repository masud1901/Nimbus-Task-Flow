import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@components/layout/Navbar'
import { Sidebar } from '@components/layout/Sidebar'

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const drawerWidth = 240
  const location = useLocation()

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 600) {
      setIsSidebarOpen(false)
    }
  }, [location])

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: 'background.default', 
      minHeight: '100vh',
      overflow: 'hidden' 
    }}>
      <Navbar 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <Sidebar 
        open={isSidebarOpen} 
        width={drawerWidth} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)`,
          ml: isSidebarOpen ? `${drawerWidth}px` : 0,
          mt: '64px',
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
} 