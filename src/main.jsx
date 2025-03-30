// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Import Mantine styles
import '@mantine/core/styles.css';
import './styles/dark-mode.css';

// Theme wrapper component to access the theme context
function ThemedApp() {
  const { darkMode } = useTheme();
  
  return (
    <MantineProvider
      theme={{
        colorScheme: darkMode ? 'dark' : 'light',
        primaryColor: 'indigo',
        defaultRadius: 'md',
      }}
    >
      <App />
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </React.StrictMode>
);