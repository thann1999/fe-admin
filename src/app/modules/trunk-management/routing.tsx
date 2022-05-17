import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/trunk-management.component';

export default function TrunkManagementRoute() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
