
//#region imports
import { List, ListItem, Dialog, Typography, DialogTitle } from '@mui/material';
import React from 'react';
import NotificationTile from './NotificationTile';
import CloseIcon from '@mui/icons-material/Close';

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const NotificationDialog = ({open , onClose }) => {
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
  const Notifications=[
    {
        amount: 20,
        item: 'Ball',
        teamName: 'Thailand Trip',
        time: '2H',
        adderName: 'Harsh Raj'
    },
    {
        amount: 20,
        item: 'Ball',
        teamName: 'Room Expense',
        time: '2H',
        adderName: 'Harsh'
    },
    {
        amount: 20,
        item: 'Ball',
        teamName: 'A',
        time: '2H',
        adderName: 'Harsh'
    },
    {
        amount: 20,
        item: 'Ball',
        teamName: 'A',
        time: '2H',
        adderName: 'Harsh'
    },
    {
        amount: 20,
        item: 'Ball',
        teamName: 'A',
        time: '2H',
        adderName: 'Harsh'
    },
    {
        amount: 20,
        item: 'Ball',
        teamName: 'A',
        time: '2H',
        adderName: 'Harsh'
    },

  ]
  //#endregion

  //#region Component renders
  return(
    <Dialog
        open={open}
        onClose={onClose}
       sx={{
        
        '& .MuiDialog-container': {
            justifyContent: {
                xs: 'center',
                sm: 'flex-end',
            },
            alignItems: 'flex-start',
            
        },
        '& .MuiPaper-root': {
            margin: {
                xs: '60px 0px',
                sm: '60px 100px'
            },
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
            Notifications
            <CloseIcon
                onClick = {onClose} 
                sx={{cursor:'pointer'}}
            />
        </DialogTitle>
        <List sx={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
            pt: 0

        }}>
            {Notifications.length > 0 ?
                Notifications.map((notification,index) => (
                    <ListItem key={index} sx={{padding:'0.2rem 0.75rem'}}>
                        <NotificationTile 
                            amount={notification.amount} 
                            teamName={notification.teamName}
                            item={notification.item} 
                            adderName={notification.adderName}
                            time={notification.time}
                        />
                    </ListItem>
                )):
                    <Typography sx={{
                        display:'flex',
                        fontSize: 22
                        }}>
                        No Request Found
                    </Typography>
            }
        </List>
      </Dialog>
  );
  //#endregion
}
//#endregion

//#region Component export
export default NotificationDialog;
//#endregion