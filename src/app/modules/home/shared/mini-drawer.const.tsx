import React from 'react';
import {
  ListAlt,
  ManageAccounts,
  PhoneForwarded,
  Route,
  Logout,
  AccountCircle,
} from '@mui/icons-material';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

export const DRAWER_WIDTH = 250;

export interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export interface MenuItemProps {
  section: string;
  menu: string[];
}

export const ICON = [
  [<ListAlt fontSize="small" />, <ManageAccounts fontSize="small" />],
  [<PhoneForwarded fontSize="small" />, <Route fontSize="small" />],
];

export const SETTING_ICON = [
  <AccountCircle fontSize="small" color="action" />,
  <Logout fontSize="small" color="action" />,
];
