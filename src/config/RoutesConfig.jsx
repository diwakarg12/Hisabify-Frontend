
//#region imports
import React from 'react';
import Loginsignup from '../Component/Pages/Login_Signup/loginsignup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const RoutesConfig = () => {
  //#region Component states
  //#endregion

  //#region Component hooks
   React.useEffect(() => {
      // Anything in here is fired on component mount.
      return () => {
          // Anything in here is fired on component unmount.
      }
    }, [])

   React.useEffect(() => {
      // Anything in here is fired on component update.
   });
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  const routes = [
    {
        path : "/",
        element : <Loginsignup />,
    },
    
  ]
  //#endregion

  //#region Component renders
  return(
    <BrowserRouter>
        <Routes>
            {routes.map((props) => (
                <Route key={props.path} path={props.path} element={props.element}/>
            ))}
        </Routes>
    </BrowserRouter>
  );
  //#endregion
}
//#endregion

//#region Component export
export default RoutesConfig;
//#endregion