
//#region imports
import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const CalenderDialog = ({open , onClose}) => {
  //#region Component states

  const specialDate = dayjs('2025-05-24');
   const [selectedDate, setSelectedDate] = React.useState(dayjs());
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
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return(
    <Dialog open={open} 
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
              xs: '65px 0 0 0',
              sm: '65px 75px 75px 75px',
            },
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
            fontSize: '1.5rem',
            alignItems:'center',
            color: '#fff',
            padding: '0.5rem 1rem',
        }}>Expense statics
        <CloseIcon
             onClick = {onClose} sx={{cursor:'pointer'}}/>
        </DialogTitle>
        <DialogContent sx={{
            padding: '0.3rem',
            borderRadius: '0.2rem',
        }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                day: (params) => ({
                  sx: {
                    ...(dayjs(params.day).isSame(dayjs(), 'day') && {
                      backgroundColor: '#e0f7fa',
                      color: '#006064',
                    }),
                    ...(dayjs(params.day).isSame(specialDate, 'day') && {
                      backgroundColor: '#ffecb3',
                      color: '#ff6f00',
                    }),
                    borderRadius: '30%',
                  },
                }),
              }}
            />
          </LocalizationProvider>
        </DialogContent>
      </Dialog>
  );
  //#endregion
}
//#endregion

//#region Component export
export default CalenderDialog;
//#endregion