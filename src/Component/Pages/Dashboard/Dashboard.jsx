
//#region imports
import { Box, Typography } from '@mui/material';
import React from 'react';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import {  yellow } from '@mui/material/colors';
import TeamTracker from '../../Common/TeamTracker/TeamTracker';
import PersonalTracker from '../../Common/PersonalTracker/PersonalTracker';

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Dashboard = () => {
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
  const teamDetails =[
    {
        teamName: 'Team A',
        totAmount: 1000,
        topCategory: 'shoping',
        yourContribution: 200,
        lastTransaction: 400           
    },
    {
        teamName: 'Team B',
        totAmount: 1000,
        topCategory: 'shoping',
        yourContribution: 200,
        lastTransaction: 400 
    },
     {
        teamName: 'Team A',
        totAmount: 1000,
        topCategory: 'shoping',
        yourContribution: 200,
        lastTransaction: 400           
    },
    {
        teamName: 'Team B',
        totAmount: 1000,
        topCategory: 'shoping',
        yourContribution: 200,
        lastTransaction: 400 
    },
  ]
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return(
    <Box sx={{backgroundColor: '#FFF',
       
        height: '110vh',
        display: 'flex',
        flexDirection:'column',
        borderRadius:2,
        
       
        }}>
        
        {/* Welcome Text */}
        <Typography sx={{
            padding: 2,
            fontSize: 20
        }}>
            Welcome Back {'userName'}
            <WavingHandIcon  sx={{
                color: yellow[600],
                marginLeft: 2
            }}/>
        </Typography>


        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: 2,
            margin: 2,
            marginTop: 0,
            gap: 2,
            border: 'solid 2px #A1A3AB',
            overflow:'auto',
            borderRadius:2,

           
        }}>

            {/* Left BOX */}
        <PersonalTracker />

        {/* Right Box */}
        <TeamTracker teamDetails={teamDetails}/>
        </Box>
    </Box>
  );
  //#endregion
}
//#endregions

//#region Component export
export default Dashboard;
//#endregion