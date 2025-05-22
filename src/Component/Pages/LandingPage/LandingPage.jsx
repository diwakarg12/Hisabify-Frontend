/* eslint-disable no-unused-vars */

//#region imports
import React, { Children } from 'react';
import Header from '../../Common/Header/Header.jsx';
import SideNav from '../../Common/SideNavBar/SideNav.jsx';
import { Box } from '@mui/material';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const LandingPage = ({ children, navkey }) => {
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
  //#endregion

  //#region Component renders
  return(
    <Box >
      
      <Header />
      <Box sx={{display:'flex', flexDirection:'row', flex:1 }}>
        <SideNav  />
        <Box sx={{flex:1 ,padding:2}}>
          {children}
        </Box>
      </Box>


    </Box>
);
  //#endregion
}
//#endregion

//#region Component export
export default LandingPage;
//#endregion