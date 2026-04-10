import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const currentRole = localStorage.getItem('role')?.toLowerCase();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && currentRole !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;