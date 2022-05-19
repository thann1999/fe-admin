import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HotlineRoutingPage from './pages/hotline-routing.component';

export default function TrunkManagementRoute() {
  return (
    <Routes>
      <Route path="/" element={<HotlineRoutingPage />} />
    </Routes>
  );
}
