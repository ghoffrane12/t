import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';

interface ThemeContextProps {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    return (localStorage.getItem('theme') as PaletteMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: '#FF5733',
        },
        background: {
          default: mode === 'dark' ? '#18191A' : '#F8F9FA',
          paper: mode === 'dark' ? '#242526' : '#fff',
        },
      },
      typography: {
        fontFamily: 'Inter, Arial, sans-serif',
      },
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}; 