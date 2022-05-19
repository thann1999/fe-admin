import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TrunkManagementPage from './pages/trunk-management.component';

export default function TrunkManagementRoute() {
  return (
    <Routes>
      <Route path="/" element={<TrunkManagementPage />} />
    </Routes>
  );
}