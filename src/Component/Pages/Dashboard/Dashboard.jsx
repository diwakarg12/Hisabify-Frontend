
//#region imports
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import {  yellow } from '@mui/material/colors';
import TeamTracker from '../../Common/TeamTracker/TeamTracker';
import PersonalTracker from '../../Common/PersonalTracker/PersonalTracker';
import AddTeam from '../../Common/AddTeam/AddTeam'
import AddExpense from '../../Common/AddExpense/AddExpense';
import Invite from '../../Common/Invite/Invite';

import { useSelector , useDispatch } from 'react-redux';
import { getAllGroup } from '../../../redux/groupSlice'
//#endregion

//#region Component make Styles
//#endregion 

//#region Function Component
const Dashboard = () => {
  //#region Component states
  const [createTeam, setCreateTeam] = useState(false)
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [openInvite , setOpenInvite] = useState(false );
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
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
      dispatch(getAllGroup());
   },[dispatch]);
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  const handleInviteButtonClick = (e) => {
    e.stopPropagation();
    setOpenInvite(true)
  }
  //#endregion

  //#region Component Api methods
  const teamDetails = useSelector(state => state.group.groups)
  // const myExpenses = useSelector(state => state.expense.groupExpenses);
  console.log("Team List ", teamDetails.groups);
  console.log("Expense List ", teamDetails.groups);

  //#endregion

  //#region Component feature methods
    const teamName = teamDetails?.groups?.map(team => team.groupName);

    // const myGroupsWithExpense =   teamDetails.groups.map(team => {
    //   const totalExpense = myExpenses.expense.filter(expense => expense.groupId === team._id)
    //     .reduce((acc, curr) => acc + curr.amount, 0); 
    //   return {
    //     teamName: team.groupName,
    //     mtTotalExpense: totalExpense
    //   };
    // });

  //#endregion

  //#region Component JSX.members

  //#endregion

  //#region Component renders
  return(
    <Box sx={{ position: 'relative' , paddingBottom:'4rem' }}>
      
      {/* Dashboard Content */}
      <Box
        sx={{
          backgroundColor: '#FFF',
          height: '110vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          pointerEvents: createTeam ? 'none' : 'auto',
          transition: 'filter 0.3s ease',
          filter: createTeam || openAddExpense ? 'blur(2px)' : 'none',
        }}
      >
        <Typography sx={{ padding: 2, fontSize: 20 }}>
          Welcome Back {user?.firstName} {user?.lastName}!
          <WavingHandIcon sx={{ color: yellow[600], marginLeft: 2 }} />
          </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: 2,
            margin: 2,
            marginTop: 0,
            gap: 2,
            border: 'solid 2px #A1A3AB',
            overflow: 'auto',
            borderRadius: 2,
          }}
        >
          <PersonalTracker setOpenAddExpense={setOpenAddExpense} teamName={teamName}/>
          <TeamTracker teamDetail={teamDetails} setCreateTeam={setCreateTeam} openInvite={openInvite} setOpenInvite={handleInviteButtonClick} handleClose={() => setOpenInvite(false)} />
        </Box>
      </Box>

      {/* Overlay */}
      {createTeam && (
        <AddTeam onClose={() => setCreateTeam(false)} />
      )}
    {openAddExpense && (
        <AddExpense openAddExpense={openAddExpense} setOpenAddExpense={setOpenAddExpense}/>
    )}
  {openInvite && (
    <Invite openInvite={openInvite} handleClose={() => setOpenInvite(false)}/>
  )}
 </Box>
  );
  //#endregion
}
//#endregions

//#region Component export
export default Dashboard;
//#endregion