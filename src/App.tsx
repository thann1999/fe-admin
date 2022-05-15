import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './translation/i18n';

const LoginRoute = React.lazy(() => import('app/modules/login/routing'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>...Loading</div>}>
        <Routes>
          <Route path="/admin/*" element={<LoginRoute />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
