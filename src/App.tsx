import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthGuard from 'routes/auth-guard';
import './styles/index.scss';
import './translation/i18n';

export const customTheme = createTheme({
  typography: {
    fontFamily: `'Inter', sans-serif`,
  },
});

const LoginRoute = React.lazy(() => import('app/modules/login/routing'));
const HomeRoute = React.lazy(() => import('app/modules/home/routing'));
const TrunkManagementRoute = React.lazy(
  () => import('app/modules/trunk-management/routing')
);
const CustomerManagementRoute = React.lazy(
  () => import('app/modules/custom-management/routing')
);

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Suspense fallback={<div>...Loading</div>}>
        <Routes>
          <Route path="/login/*" element={<LoginRoute />} />
          <Route
            path="/admin/home/*"
            element={
              <AuthGuard>
                <HomeRoute />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/trunk-management/*"
            element={
              <AuthGuard>
                <TrunkManagementRoute />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/customer-management/*"
            element={
              <AuthGuard>
                <CustomerManagementRoute />
              </AuthGuard>
            }
          />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
