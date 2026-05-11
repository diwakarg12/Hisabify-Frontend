// export default WithAuthRoutes;
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SkeletonLoader from "../Component/Common/SkeletonLoader/SkeletonLoader";

const WithAuthRoutes = ({ children }) => {
  const { isAuthenticated, authLoading } = useSelector((store) => store.auth);

  if (authLoading)
    return <SkeletonLoader />;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default WithAuthRoutes;
