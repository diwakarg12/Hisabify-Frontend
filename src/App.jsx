import RoutesConfig from "./config/RoutesConfig";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/authSlice";
import { GlobalLoaderProvider } from "./Component/Common/Loader/GlobalLoaderContext";
import { ConfirmDialogProvider } from "./Component/Common/Modal/ConfirmDialogContext";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
};

function App() {
  return (
    <GlobalLoaderProvider>
      <ConfirmDialogProvider>
        <div className="flex flex-col bg-gray-300">
          <AppInitializer>
            <RoutesConfig />
          </AppInitializer>
        </div>
      </ConfirmDialogProvider>
    </GlobalLoaderProvider>
  );
}

export default App;
