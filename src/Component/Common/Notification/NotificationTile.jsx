
//#region imports
import { Box, Typography } from '@mui/material';
import React from 'react';
import { red } from '@mui/material/colors';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const NotificationTile = ({amount, item, teamName , adderName, time}) => {
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
    <Box sx={{
        backgroundColor: red[300],
        borderRadius: 1,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        // padding:' 0.1rem 1rem',
    }}>
        <Typography sx={{color:'white', 
          // padding:'1rem', 
          // paddingBottom:'0rem', 
          fontSize:'16px' }}>
            Added Rs.{amount} for {item} 
        </Typography >
        <Typography sx={{
          // paddingLeft:'1rem', 
          color:'black', fontSize:'14px'}}>
            In team {teamName} by {adderName}. {time}
        </Typography>
    </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default NotificationTile;
//#endregion