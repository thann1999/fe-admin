import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home.component';

export default function HomeRoute() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
