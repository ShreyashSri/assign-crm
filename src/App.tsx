// src/App.tsx

import React from 'react';
import { ExcelGridMUI } from './components/ExcelGridMUI';
import { Box, Typography } from '@mui/material';

function App() {
  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Excel Data Importer
      </Typography>
      <ExcelGridMUI />
    </Box>
  );
}

export default App;