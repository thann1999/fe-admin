import { Stack } from '@mui/material';
import React from 'react';
import MiniDrawer from '../drawer/drawer.component';

function DrawerLayout({ children }: { children: JSX.Element }) {
  return (
    <>
      <MiniDrawer />

      {children}
    </>
  );
}

export default DrawerLayout;
