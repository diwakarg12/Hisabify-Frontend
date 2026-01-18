// export default WithAuthRoutes;
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../redux/authSlice";

const WithAuthRoutes = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!isAuthenticated && !user) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, user]);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
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
