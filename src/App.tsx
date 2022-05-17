import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './translation/i18n';
import './styles/index.scss';
import AuthGuard from 'routes/auth-guard';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

export const customTheme = createTheme({
  typography: {
    fontFamily: `'Inter', sans-serif`,
  },
});

const LoginRoute = React.lazy(() => import('app/modules/login/routing'));
const HomeRoute = React.lazy(() => import('app/modules/home/routing'));

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Suspense fallback={<div>...Loading</div>}>
        <Routes>
          <Route path="/admin/login" element={<LoginRoute />} />
          <Route
            path="/admin/home"
            element={
              <AuthGuard>
                <HomeRoute />
              </AuthGuard>
            }
          />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
