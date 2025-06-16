
//#region imports
import { red } from '@mui/material/colors';
import React from 'react';
import TeamCart from '../TeamCart/TeamCart';
import { Box, Typography, Link } from '@mui/material';
// import { Link } from 'react-router-dom';
import { Groups  } from '@mui/icons-material';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const TeamTracker = ({teamDetails, setCreateTeam , openInvite , setOpenInvite, handleClose}) => {
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
    <Box  sx={{
            width: '50%',
            padding: 1,
            boxShadow: 3,
            overflow:'auto',
            '&::-webkit-scrollbar': {
            display: 'none',
        },
        }}>
            <Typography sx={{
                 alignItems: 'center',
                display: 'flex',
                justifyContent:'center',
                fontSize: 20 ,
            }}>
                Team Tracker
            </Typography>

             <Link to={'/'} sx={{
                display: 'flex',
                textDecoration:'underline',
                width: '90%',
                margin: '0 auto',
                gap:1,

            }}>
                <Groups sx={{ color: '#A1A3AB'}} />
                <Typography sx={{
                    color: red[300],
                    // paddingLeft:1,
                    textDecoration: 'none',
                    cursor: 'pointer'
                }}
                onClick={()=>setCreateTeam(true)}
                >
                    Add Team
                </Typography>
            </Link>
            
            <Box sx={{padding: 2}}>
                {teamDetails.map((teamDetail)=>(
                 <TeamCart
                    teamDetails={teamDetail}
                    openInvite ={openInvite}
                    handleClose ={handleClose}
                    setOpenInvite ={setOpenInvite}
            />
            ))}
            </Box>
           
        </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default TeamTracker;
//#endregion