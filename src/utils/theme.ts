import { createTheme, alpha } from '@mui/material'

// Tokyo Night inspired colors
const colors = {
  background: '#1a1b26',
  paper: '#24283b',
  primary: '#7aa2f7',
  secondary: '#bb9af7',
  success: '#9ece6a',
  error: '#f7768e',
  warning: '#e0af68',
  info: '#7dcfff',
  textPrimary: '#c0caf5',
  textSecondary: '#a9b1d6',
  divider: '#292e42',
  accent1: '#ff9e64',
  accent2: '#73daca',
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      light: alpha(colors.primary, 0.8),
      dark: alpha(colors.primary, 0.6),
    },
    secondary: {
      main: colors.secondary,
      light: alpha(colors.secondary, 0.8),
      dark: alpha(colors.secondary, 0.6),
    },
    background: {
      default: colors.background,
      paper: colors.paper,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    success: {
      main: colors.success,
    },
    info: {
      main: colors.info,
    },
    divider: colors.divider,
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${colors.divider} ${colors.background}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
            backgroundColor: colors.background,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: colors.divider,
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(colors.primary, 0.4),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(colors.primary, 0.1)}`,
          boxShadow: `0 4px 20px ${alpha(colors.background, 0.7)}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 30px ${alpha(colors.primary, 0.2)}`,
            border: `1px solid ${alpha(colors.primary, 0.2)}`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha(colors.primary, 0.4)}`,
          },
        },
        contained: {
          background: `linear-gradient(45deg, ${colors.primary}, ${alpha(colors.secondary, 0.8)})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${alpha(colors.primary, 0.9)}, ${alpha(colors.secondary, 0.7)})`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: alpha(colors.primary, 0.2),
            },
            '&:hover fieldset': {
              borderColor: alpha(colors.primary, 0.3),
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary,
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background,
          borderRight: `1px solid ${alpha(colors.primary, 0.1)}`,
          '& .MuiListItem-root': {
            margin: '8px',
            borderRadius: 8,
            '&:hover': {
              backgroundColor: alpha(colors.primary, 0.1),
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.background, 0.8),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(colors.primary, 0.1)}`,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        filled: {
          backgroundColor: alpha(colors.primary, 0.1),
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.2),
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${alpha(colors.primary, 0.9)}, ${alpha(colors.secondary, 0.9)})`,
          },
        },
      },
    },
  },
}) 