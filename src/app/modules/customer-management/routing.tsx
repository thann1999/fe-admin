import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CustomerPage from './pages/customer-management/customer-management.component';
import CustomerDetailPage from './pages/customer-detail/customer-detail.component';

export default function TrunkManagementRoute() {
  return (
    <Routes>
      <Route path="/" element={<CustomerPage />} />
      <Route path="/detail/:id" element={<CustomerDetailPage />} />
    </Routes>
  );
}
