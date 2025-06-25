
//#region imports
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import TeamListCart from '../../Common/TeamListCart/TeamListCart';
import MultiChart from '../../Common/Chart_Graph/MultiChart';
import ProfileImg from '../../../assets/profile.jpg';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DropDownButton from '../../Common/DropDownButton/DropDownButton';

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const MyExpense = () => {
  //#region Component states
  const [toggleChart , settoggleChart] = React.useState(false);
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
  const teamDetails = 
    {
        teamName: 'My Personal Expense',
        totAmount: 1000,
        topCategory: 'shoping',
        yourContribution: 200,
        lastTransaction: 400  
    }

const data = [
  { label: 'Group A', value: 400, color: '#0088FE' },
  { label: 'Group B', value: 300, color: '#00C49F' },
  { label: 'Group C', value: 300, color: '#FFBB28' },
  { label: 'Group D', value: 200, color: '#FF8042' },
];

 const datacategory = [
  { label: 'Shoping', value: 400, color: '#0088FE' },
  { label: 'Study', value: 300, color: '#00C49F' },
  { label: 'Phone', value: 300, color: '#FFBB28' },
  { label: 'Misscellenous', value: 200, color: '#FF8042' },
  { label: 'Shoping', value: 400, color: '#0088FE' },

];
  //#endregion

  //#region Component renders
  return(
  <Box sx={{
    display:'flex',
    flexDirection: 'column',
      padding:'2rem',
      gap:2,
      
    }}>

    <Card sx={{ display: 'flex' , justifyContent:'space-between', padding: 2, boxShadow:13}}>
        {/* <Avatar 
            alt='profile'
            src={ProfileImg}
           sx={{
            height: 50,
            width: 50
           }}
        /> */}
        <img 
            alt='profile'
            src={ProfileImg}
            style={{
                height: '3rem',
                width: '3rem',
                
            }}/>
         <Typography variant="h5" fontSize={
            {
                xs: '1rem',
                sm: '1.5rem',
                md: '1.75rem',
                lg: '2rem',
                xl: '3rem',
            }
            } sx={{}}>
                Harsh's Expense 
        </Typography>
        <Button
            variant="outlined"
            size="medium"
            // startIcon={<GroupsIcon />}
            onClick={() => {}}
            sx={{textTransform: 'none' ,
            backgroundColor: '#ff6467', 
            color:'white',
            boxShadow: 3,
            fontWeight:600,
            marginRight:2,
            }}
        >
            Add Expense
        </Button>
    </Card>
   
     <Card sx={{display:'flex' , flexDirection:'column', boxShadow: 5, height:'65vh',}}>

            {/* Buttons Pane */}
        <Box sx={{
            display:'flex',
            justifyContent: 'center',
            width: '100%',
            padding: '1rem',
            gap: 6,
            borderBottom: 'solid #d1d5db 3px',
        }}>

        <Button
            variant="outlined"
            size="large"
            // startIcon={<GroupsIcon />}
            onClick={() => {settoggleChart(!toggleChart)}}
            sx={{textTransform: 'none' ,
            backgroundColor: '#ff6467', 
            color:'white',
            boxShadow: 3,
            fontWeight:600,
            
            }}
        >
            {toggleChart ? 'Group Chart' : 'Category Chart'} 
        </Button>

         <Button
            variant="outlined"
            size="large"
            // startIcon={<GroupsIcon />}
            onClick={() => {}}
            sx={{textTransform: 'none' ,
            backgroundColor: '#ff6467', 
            color:'white',
            boxShadow: 3,
            fontWeight:600,
            
            }}
        >
            Transactions
        </Button>

        <DropDownButton />

        </Box>
        

        <Box sx={{display: 'flex', gap:6, padding: 4 }}>
            <CardContent >
                <Typography variant="h6" >
                <strong>Total Monthly Income :</strong> {teamDetails.totAmount}
                </Typography>
                <Typography variant="h6" >
                <strong>Total Monthly Spend :</strong> {teamDetails.totAmount}
                </Typography>

                <Typography variant="h6" >
                <strong>Top Category :</strong>{' '}
                <Box component="span" sx={{ color: 'error.main', fontWeight: 600 }}>
                    {teamDetails.topCategory}
                </Box>
                </Typography>

                <Typography variant="h6" >
                <strong>Top Spend :</strong> {teamDetails.yourContribution}
                </Typography>

                <Typography variant="h6" >
                <strong>Last Transaction:</strong> {teamDetails.yourContribution}
                </Typography>
            </CardContent>
                
            <MultiChart data={toggleChart ? datacategory : data} outerRadius={100}/>
        </Box>

    </Card>

     

     
     
     
    </Box>);
  //#endregion
}
//#endregion

//#region Component export
export default MyExpense;
//#endregion