import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Stack, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import logo from 'app/assets/images/leeon-logo.png';
import miniLogo from 'app/assets/images/mini-logo.png';
import clsx from 'clsx';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './mini-drawer.style.scss';

const drawerWidth = 250;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 6px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 6px)`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(!open && {
    width: `calc(100% - ${theme.spacing(7)} - 6px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${theme.spacing(8)} - 6px)`,
    },
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface MenuItem {
  section: string;
  menu: string[];
}

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);
  const listItem = React.useRef<MenuItem[]>([
    {
      section: 'MANAGEMENT',
      menu: ['Trunk Management', 'Customer Management'],
    },
    {
      section: 'ROUTING',
      menu: ['Hotline Routing', 'Virtual Routing'],
    },
  ]).current;
  const handleDrawer = () => {
    setOpen((previous) => !previous);
  };

  return (
    <div className="mini-drawer">
      <AppBar position="fixed" open={open} className="app-bar">
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            sx={{ marginLeft: 0 }}
          >
            {open ? <ArrowForwardIosIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open} className="drawer-content">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          className={clsx({ 'mt--XS mb--XS': !open }, 'mt--XXS')}
        >
          <Link to="/admin/home">
            <img
              src={open ? logo : miniLogo}
              alt=""
              width={open ? 120 : 25}
              height={open ? 60 : 25}
            />
          </Link>
        </Stack>

        <List>
          {listItem.map((item) => (
            <div key={item.section} className={clsx({ 'mt--XS': open })}>
              {open && (
                <Typography className="section">{item.section}</Typography>
              )}

              {item.menu.map((menu, index) => (
                <ListItem key={menu} disablePadding className="item">
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {index % 2 === 0 ? (
                        <InboxIcon fontSize="small" />
                      ) : (
                        <MailIcon fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={menu}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </div>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
