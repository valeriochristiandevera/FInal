import { createTheme } from '@mui/material/styles';

// YouTube-inspired color palette with all color tokens
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF0000', // YouTube Red
      light: '#FF3333',
      dark: '#CC0000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#606060', // Secondary gray
      light: '#808080',
      dark: '#404040',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF0000',
    },
    warning: {
      main: '#FF0000',
    },
    info: {
      main: '#3366CC', // Link blue
    },
    success: {
      main: '#2BA640',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F0F0F',
      secondary: '#606060',
    },
    divider: '#E5E5E5',
    // Custom color tokens for the application
    colors: {
      // Primary colors
      white: '#FFFFFF',
      black: '#000000',
      // Background colors
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F2F2F2',
      bgTertiary: '#F8F8F8',
      // Text colors
      textPrimary: '#0F0F0F',
      textSecondary: '#606060',
      textTertiary: '#323232',
      textMuted: '#585858',
      // Border colors
      borderPrimary: '#CCCCCC',
      borderSecondary: '#E5E5E5',
      // Action colors
      link: '#3366CC',
      hover: '#F2F2F2',
      // State colors
      success: '#2BA640',
      error: '#FF0000',
      warning: '#FF0000',
      info: '#3366CC',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0F0F0F',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&:hover': {
            backgroundColor: '#F2F2F2',
          },
          '&.Mui-selected': {
            backgroundColor: '#F2F2F2',
            '&:hover': {
              backgroundColor: '#F2F2F2',
            },
          },
        },
      },
    },
  },
});

// Export custom color tokens for use in components
export const colors = {
  // Primary colors
  white: '#FFFFFF',
  black: '#000000',
  // Background colors
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F2F2F2',
  bgTertiary: '#F8F8F8',
  // Text colors
  textPrimary: '#0F0F0F',
  textSecondary: '#606060',
  textTertiary: '#323232',
  textMuted: '#585858',
  // Border colors
  borderPrimary: '#CCCCCC',
  borderSecondary: '#E5E5E5',
  // Action colors
  link: '#3366CC',
  hover: '#F2F2F2',
  // State colors
  success: '#2BA640',
  error: '#FF0000',
  warning: '#FF0000',
  info: '#3366CC',
};

export default theme;
