import { Typography } from '@mui/material';
import React from 'react';
import './home-page.style.scss';
import { Helmet } from 'react-helmet';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <div className="welcome">
        <Typography variant="h3">Welcome to WEB MNP</Typography>
      </div>
    </>
  );
}

export default HomePage;
