
//#region imports
import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Members = ({user ,index,memberDetail}) => {
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
  const handleCancelClick = () => {
    console.log('cancel clicked');
  }
  //#endregion

  //#region Component JSX.members
  
  const ownerId = 1
  //#endregion

  //#region Component renders
  return(
    <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mt={2}>
      <Box display="flex" alignItems="center">
        <Avatar src={user.avatar} sx={{ mr: {xs: 1, sm: 2} }} />
        <Box>
          <Typography>{user.firstName +' '+ user.lastName}</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        </Box>
      </Box>

      {
        memberDetail 
        ?
          (
            <Typography sx={{border: '1.5px solid #E57373' , padding:{xs:'0.5rem 1.25rem', sm: '0.5rem 2rem'}}}>
              {user._id === ownerId ? 'Owner' : 'Member'}
            </Typography> 
          )
        :
          (
            <Typography sx={{border: '1.5px solid #E57373' , padding:{xs:'0.5rem 1.25rem', sm: '0.5rem 2rem'}}} onClick={handleCancelClick}>
              Cancel
            </Typography>
          )
      }
       
    </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default Members;
//#endregion