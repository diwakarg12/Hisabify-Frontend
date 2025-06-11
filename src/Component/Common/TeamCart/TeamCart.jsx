
//#region imports
import { Avatar, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import img from '../../../assets/profile.jpg';
import { red } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const TeamCart = ({teamDetails ,setOpenInvite }) => {
    const {teamName ,totAmount ,topCategory ,yourContribution ,lastTransaction} = teamDetails
    const navigate = useNavigate();
  //#region Component states
  // const navigate = useNavigate()
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
  const handleTeamExpenseNavigation = () => {
    navigate('/expenselist')
  }
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  // const handleCartCick = () => {
  //   console.log('card clicked');
  //   navigate("/expenselist")
  // }
  //#endregion

  //#region Component JSX.members
  const avatars = [
   
    img,
    img,
    img,
    img,

  ];
  //#endregion

  //#region Component renders
  return(
    <Card  variant="outlined" onClick={handleTeamExpenseNavigation}  sx={{ borderRadius: 3, padding: 2 , bgcolor: '#F5F8FF', marginY: 2, boxShadow: 3}}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="h6" fontWeight="bold">
            {teamName}
          </Typography>
          
        </Box>

        <Typography variant="body2" mb={0.5}>
          <strong>Total Spend :</strong> {totAmount}
        </Typography>

        <Typography variant="body2" mb={0.5}>
          <strong>Top Category :</strong>{' '}
          <Box component="span" sx={{ color: 'error.main', fontWeight: 600 }}>
            {topCategory}
          </Box>
        </Typography>

        <Typography variant="body2" mb={0.5}>
          <strong>Your Contribution :</strong> {yourContribution}
        </Typography>

        <Typography variant="body2" mb={2}>
          <strong>Last Transaction :</strong> {lastTransaction}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={-1}>
            {avatars.map((src, index) => (
              <Avatar
                key={index}
                src={src}
                sx={{
                  border: '2px solid white',
                  width: 32,
                  height: 32,
                  zIndex: avatars.length - index,
                }}
              />
            ))}
          </Stack>

         <Box sx={{ display: "flex" , gap: 2}}>
           <Button
            variant="outlined"
            size="small"
            startIcon={<GroupAddIcon />}
            onClick={ setOpenInvite }
            sx={{ borderRadius: 3, textTransform: 'none' ,color: red[400]}}
          >
            Invite
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<GroupAddIcon />}
            sx={{ borderRadius: 3, textTransform: 'none' ,color: red[400]}}
          >
            Add Expense
          </Button>
         </Box>
        </Box>
      </CardContent>
    </Card>
  );
  //#endregion
}
//#endregion

//#region Component export
export default TeamCart;
//#endregion