//#region imports
import React from 'react';
import {
    Dialog,
    DialogTitle,
    List,
    ListItem,
    Typography,
} from '@mui/material'
import RequestTile from './RequestTile';
import CloseIcon from '@mui/icons-material/Close';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const RequestDailog = ({open, onClose}) => {
  //#region Component states
  //#endregion
  
  // #region Component hooks
  
  //#endregion
  
  //#region Component use Styles
  //#endregion
  
  //#region Component validation methods
  //#endregion
  
  //#region Component Api methods
  //#endregion
  
  //#region Component feature methods
  const Requests = [
    {
        id: 1,
        teamName: 'Team A',
        requester: 'Harsh',
        time: '2h'
    },
     {
        id: 2,
        teamName: 'Team B',
        requester: 'Harsh',
        time: '2h'
    },
     {
        id: 3,
        teamName: 'Team C',
        requester: 'Harsh',
        time: '2h'
    },
    {
        id: 4,
        teamName: 'Team A',
        requester: 'Harsh',
        time: '2h'
    },
     {
        id: 5,
        teamName: 'Team B',
        requester: 'Harsh',
        time: '2h'
    },
     {
        id: 6,
        teamName: 'Team C',
        requester: 'Harsh',
        time: '2h'
    }
  ]
  //#endregion
  
  //#region Component JSX.members
  //#endregion
  
  //#region Component renders
  return(
  <Dialog 
    maxWidth={'xs'}  
    open={open}
    onClose={onClose}
    sx={{
      '& .MuiDialog-container': {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      },
      '& .MuiPaper-root': {
        margin: '150px',
        marginTop: '60px',
        maxHeight: '70vh',
        backgroundColor: 'rgba(255, 100, 103, 1)',
        scrollbarWidth: 'none',
        scrollbarColor: '#fff rgba(0, 0, 0, 0.1)',
      },
    
    }}
    >
      <DialogTitle sx={{
        display:'flex',
        justifyContent:'space-between',
        fontWeight: 700,
        fontSize: '1.8rem',
        alignItems:'center',
        color: '#fff'
        }}>
        Requests
        <CloseIcon
             onClick = {onClose} sx={{cursor:'pointer'}}/>
      </DialogTitle>
      <List sx={{ pt: 0 }} >
       
        {Requests && Requests.length !== 0 ?
        Requests.map((request, index) => (
          (<ListItem disablePadding key={`${request.id}-${index}`} sx={{padding:'0.1rem 0.5rem'}}>
            <RequestTile teamName={request.teamName} time={request.time} requester={request.requester}/>
          </ListItem>)
        ))
        :
        <Typography sx={{padding: '1rem 3rem', fontSize: 22}}>
          No Request Found
        </Typography>
        }
      </List>
    </Dialog>);
  //#endregion
}
//#endregion

//#region Component export
export default RequestDailog;
//#endregion