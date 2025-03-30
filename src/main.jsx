// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import App from './App.jsx';

// Import Mantine styles
import '@mantine/core/styles.css';

// Create a custom theme
const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  colors: {
    // Custom color palette matching the design
    indigo: [
      '#EDF2FF', // 0
      '#DBE4FF', // 1
      '#BAC8FF', // 2
      '#91A7FF', // 3
      '#748FFC', // 4
      '#5C7CFA', // 5
      '#4C6EF5', // 6
      '#4263EB', // 7
      '#3B5BDB', // 8
      '#364FC7', // 9
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);