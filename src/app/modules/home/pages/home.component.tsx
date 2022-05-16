import { Stack, Typography } from '@mui/material';
import React from 'react';
import MiniDrawer from '../components/mini-drawer/mini-drawer.component';

function HomePage() {
  return (
    <Stack direction="row" spacing={0}>
      <MiniDrawer />

      <div className="mt--XXXL">
        <Typography>Hello</Typography>
      </div>
    </Stack>
  );
}

export default React.memo(HomePage);
