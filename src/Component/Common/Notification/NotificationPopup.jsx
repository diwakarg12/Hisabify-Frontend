
//#region imports
import { List, ListItem, Popover, Typography, Box } from '@mui/material';
import React from 'react';
import NotificationTile from './NotificationTile';
import CloseIcon from '@mui/icons-material/Close';

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const NotificationPopup = ({open , onClose }) => {
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
    <Popover
        open={open}
        onClose={onClose}
        anchorReference="anchorPosition"
        anchorPosition={{ 
            top: 50, 
            left: 950 
        }}
        PaperProps={{
            sx :
            {
                backgroundColor:'#D1D5DB',
                height: '16rem',
                padding:0,
                '&::-webkit-scrollbar': {
                display: 'none',
                },
            }
        }}
      >
        <Box sx={{
            display : 'flex',
            justifyContent:'space-between',
            alignItems:'center',
            padding: '0.5rem',
            paddingBottom:'0'
        }}>
            <Typography sx={{
                display:'flex',
                justifyContent:'center',
                fontWeight: 700,
                fontSize: '1.5rem',
                }}>
                    Notifications 
            </Typography>
            <CloseIcon 
             onClick = {onClose} sx={{cursor:'pointer' , }}/>
        </Box>



        <List sx={{
            padding:0,

        }}>
            {Notifications.length > 0 ?
                Notifications.map((notification,index) => (
                    <ListItem key={index}>
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
                        // padding: '1rem 3rem', 
                        display:'flex',
                        fontSize: 22
                        }}>
                        No Request Found
                    </Typography>
            }
        </List>
      </Popover>
  );
  //#endregion
}
//#endregion

//#region Component export
export default NotificationPopup;
//#endregion