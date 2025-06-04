/* eslint-disable no-unused-vars */

//#region imports
import React from 'react';
import LandingPage from '../Component/Pages/LandingPage/LandingPage';
import RequestTile from './Common/Request/RequestTile';
import NotificationTile from './Common/Notification/NotificationTile';
import Chart from './Common/Chart/Chart';
import { Gauge, gaugeClasses } from '@mui/x-charts'
import { Dashboard, Height } from '@mui/icons-material';
import TeamCart from './Common/TeamCart/TeamCart';
import { Card } from '@mui/material';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Test = () => {
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
    <LandingPage navkey={"test"}>
         <content>
          <div> this is test </div>
          {/* <Chart  name= 'A' value={300} totValue={1000} size={ 200 }/> */}
         </content>
         
         <TeamCart  teamDetails={{teamName: 'Thailand Trip', totAmount:4000 ,topCategory: 'shoping' ,yourContribution: 2100 ,lastTransaction: 300}}/>
        
    </LandingPage>
  );
  //#endregion
}
//#endregion

//#region Component export
export default Test;
//#endregion