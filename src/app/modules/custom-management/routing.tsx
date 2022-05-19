import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CustomerPage from './pages/customer-management.component';

export default function TrunkManagementRoute() {
  return (
    <Routes>
      <Route path="/" element={<CustomerPage />} />
    </Routes>
  );
}
