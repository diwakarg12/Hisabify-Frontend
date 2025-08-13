
//#region imports
import { Avatar, Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Members from './Members';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Invite = ({ openInvite, handleClose }) => {
  //#region Component states
 const [memberDetail , setMemberDetail] = useState(true)
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
  const membersList = [
  { firstName: 'Varsha Roy',lastName : 'Roy', email: 'varsharoy@gmail.com', avatar: 'https://i.pravatar.cc/150?img=1', role: 'Can edit' },
  { firstName: 'Raj Aaran',lastName : 'Roy', email: 'rajayaran@gmail.com', avatar: 'https://i.pravatar.cc/150?img=2', role: 'Can edit' },
  { firstName: 'Harsh Raj',lastName : 'Roy', email: 'rajharsh@gmail.com', avatar: 'https://i.pravatar.cc/150?img=3', role: 'Owner' },
  { firstName: 'Riya Joe',lastName : 'Roy', email: 'joeriya@gmail.com', avatar: 'https://i.pravatar.cc/150?img=4', role: 'Can edit' },
];

const user =[{
    _id : 1
    ,firstName : 'Harsh',
    lastName : 'Raj',
    email: 'harhs@gmail.com',
    profile: ''
  }]

  const formateData = memberDetail ? membersList : user
  //#endregion

  //#region Component renders
  return(
    <Modal open={openInvite} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {
          xs: '92vw',
          sm: '70vw',
        },
        height:'80vh',
        backgroundColor: 'white' ,
        borderRadius: {
          xs: 1,
          sm: 2,
        },
        boxShadow: 24,
        py: 3,
        px:1.5,
        overflow: 'auto',
       '&::-webkit-scrollbar': {
            display: 'none',
        },
        }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" >
            Invite new members
          </Typography>
          <Typography onClick={handleClose} color='primary' sx={{textDecoration: 'underline', cursor: 'pointer'}}> Go Back</Typography>
        </Box>

        <Box
          sx={{
            display:'flex', 
            gap:2,
            my: 2
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Email"    
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: '#f44336' ,width : '20%' }}
          >
            Invite
          </Button>
        </Box>

        <Box my={2}>
          <Box sx={{display: 'flex', gap: 2}}>
            <Typography variant="subtitle1" fontWeight="bold" onClick={() => setMemberDetail(true) } sx={{ cursor:'pointer' , opacity: !memberDetail ? 0.6 : 1}}>Members</Typography>
            <Typography variant="subtitle1" fontWeight="bold" onClick={() => setMemberDetail(false) } sx={{ cursor:'pointer' , opacity: memberDetail ? 0.6 : 1}}>Pending Requests</Typography>
          </Box>
          {formateData.map((user, index) => (
            <Members user={user} index={index} memberDetail={memberDetail}/>
          ))}
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold">Team Invite Link</Typography>
          <Box display="flex" gap={1} >
            <TextField
              fullWidth
              variant="outlined"
              placeholder='Link'
            />
            <Button variant="contained" sx={{width: '20%' , backgroundColor: '#f44336'}}>Copy</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
  //#endregion
}
//#endregion

//#region Component export
export default Invite;
//#endregion