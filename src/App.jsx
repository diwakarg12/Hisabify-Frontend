import RoutesConfig from "./config/RoutesConfig";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/authSlice";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
};

function App() {
  return (
    <div className="flex flex-col bg-gray-300">
      <AppInitializer>
        <RoutesConfig />
      </AppInitializer>
    </div>
  );
}

export default App;
