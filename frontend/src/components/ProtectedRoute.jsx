import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../api';

// no token means the page is not for guests
function ProtectedRoute() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
