// export default WithAuthRoutes;
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const WithAuthRoutes = ({ children }) => {
  const { isAuthenticated, authLoading } = useSelector((store) => store.auth);

  if (authLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default WithAuthRoutes;

// fetch("https://hisabify-api.vercel.app/auth/check", {
//   credentials: "include",
// })
//   .then((res) => res.json())
//   .then((data) => {
//     setIsAuthenticated(data.authenticated);
//   })
//   .catch(() => setIsAuthenticated(false));
