
//#region imports
import { Box, Typography } from '@mui/material';
import React from 'react';
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
        backgroundColor: 'white',
        borderRadius: 1,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        padding:' 0.75rem',
        width: '18rem',
    }}>
        <Typography sx={{ 
          paddingBottom:'0rem', 
          fontSize:'14px', fontWeight: 'bold',}}>
            {teamName} Group has a new entry by {adderName}.
        </Typography >
        <Typography sx={{
          fontSize:'12px'}}
          >
            ₹ {amount} added for {item} just {time} ago.
        </Typography>
    </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default NotificationTile;
//#endregion