import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  isGuest?: boolean;
};

export const ProtectedRoute = ({
  isGuest = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();

  const { user, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isGuest && user) {
    return <Navigate to="/" replace />;
  }

  if (!isGuest && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
