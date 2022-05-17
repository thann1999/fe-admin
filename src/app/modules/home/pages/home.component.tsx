import { TextField, Typography } from '@mui/material';
import React from 'react';
import './home-page.style.scss';

function HomePage() {
  return (
    <div className="welcome">
      <Typography variant="h3">Welcome to WEB MNP</Typography>

      <TextField variant="outlined" className="mt--XXS" />
    </div>
  );
}

export default HomePage;
