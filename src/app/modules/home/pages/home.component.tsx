import { Stack, Typography } from '@mui/material';
import React from 'react';
import MiniDrawer from '../components/mini-drawer/mini-drawer.component';
import './home-page.style.scss';

function HomePage() {
  return (
    <Stack direction="row" spacing={0}>
      <MiniDrawer />

      <div className="welcome">
        <Typography variant="h3">Welcome to WEB MNP</Typography>
      </div>
    </Stack>
  );
}

export default React.memo(HomePage);
