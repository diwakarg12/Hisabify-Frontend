// export default WithAuthRoutes;
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const WithAuthRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/auth/check', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      setIsAuthenticated(data.authenticated);
    })
    .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default WithAuthRoutes;
