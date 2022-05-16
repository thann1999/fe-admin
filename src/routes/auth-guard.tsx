import React from 'react';
import { useAppSelector } from 'app/services/redux/hooks';
import { selectUser } from 'app/services/redux/slices/user-slice';
import { Navigate, useLocation } from 'react-router-dom';

function AuthGuard({ children }: { children: JSX.Element }) {
  const auth = useAppSelector(selectUser);
  const location = useLocation();

  if (auth.id) {
    return children;
  }

  return <Navigate to="/admin/login" state={{ from: location }} replace />;
}

export default AuthGuard;
