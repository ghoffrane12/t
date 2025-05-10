import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5733', // La couleur orange du logo
    },
    background: {
      default: '#000000', // Couleur de fond noire
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 250, // Largeur fixe pour le menu
          backgroundColor: '#1A1A1A', // Couleur de fond sombre
          color: '#FFFFFF', // Couleur du texte
          borderRight: 'none', // Supprime la bordure
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(255, 87, 51, 0.1)', // Effet hover discret
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 87, 51, 0.2)', // Couleur quand sélectionné
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'transparent',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#000000',
          },
          '& .MuiInputLabel-root': {
            color: '#000000',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '12px',
        },
        contained: {
          backgroundColor: '#FF5733',
          '&:hover': {
            backgroundColor: '#ff6b4a',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default theme; 