
//#region imports
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const RequestTile = ({time , requester , teamName}) => {
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
        backgroundColor: '#fff', 
        borderRadius: 1 ,
    }}>
        <Typography sx={{color:'black', padding:'1rem', paddingBottom:'0rem', fontSize:'16px' }}>
            Requesting You to add in {teamName}.
            
        </Typography>
        <Typography sx={{paddingLeft:'1rem', color:'#A1A3AB', fontSize:'12px'}}>By {requester}, {time}</Typography>
        <Box sx={{display:'flex', gap: 2,  padding:'0.5rem 1rem'}}>
            <Button variant='contained' color='success' sx={{
                borderRadius: '15px',
                padding:'0.25rem 1rem',
                
                
                
            }}>Accept</Button>
            <Button variant='contained' color='error'  sx={{
                borderRadius: '15px',
                padding:'0.25rem 1rem'
            }}>Reject</Button>

        </Box>
    </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default RequestTile;
//#endregion