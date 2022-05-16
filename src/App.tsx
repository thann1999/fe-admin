import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './translation/i18n';
import './styles/index.scss';
import AuthGuard from 'routes/auth-guard';

const LoginRoute = React.lazy(() => import('app/modules/login/routing'));
const HomeRoute = React.lazy(() => import('app/modules/home/routing'));

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
