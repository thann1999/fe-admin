import { Typography } from '@mui/material';
import React from 'react';
import './home-page.style.scss';
import { Helmet } from 'react-helmet';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>

      <div className="welcome">
        <Typography variant="h3">Chào mừng đến với web quản lý MNP</Typography>
      </div>
    </>
  );
}

export default HomePage;
