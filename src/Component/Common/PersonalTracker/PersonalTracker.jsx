
//#region imports
import { PendingActionsOutlined } from '@mui/icons-material';
import { Box, Card, Typography, Link } from '@mui/material';
import { red } from '@mui/material/colors';
import React from 'react';
// import { Link } from 'react-router-dom';
import Chart from '../Chart/Chart';
import AddExpense from '../AddExpense/AddExpense';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const PersonalTracker = ({totTransaction ,category, totSpent, lastUpdated, setOpenAddExpense}) => {
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
    <Box sx={{
            width: '50%',
            padding: 1,
            borderRadius: 2,
            boxShadow: 3,
            overflow:'auto'
        }}>
            <Typography sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent:'center',
                fontSize: 20 ,
                // textDecoration: 'underline',
            }}>
                Personal Tracker
            </Typography>

            <Link sx={{
                display: 'flex',
                textDecoration:'underline',
                width: '90%',
                margin: '0 auto',
                gap:1,
            }}>
                <PendingActionsOutlined sx={{ color: '#A1A3AB'}} />
                <Typography 
                    onClick ={() => setOpenAddExpense(true)}
                    sx={{
                    color: red[300],
                    // paddingLeft:1,
                    textDecoration: 'none',
                    cursor: 'pointer'
                }}>
                    Add Expense
                </Typography>
                
            </Link>

            <Card sx={{width: '90%'  , border: 'solid #A1A3AB 2px', borderRadius: 2 , margin: '1rem auto'}}>
                <Typography sx={{display: 'flex', alignItems: 'center' , padding: 1, gap: 1}}>
                    <Box sx={{
                        height: '1rem',
                        width:'1rem',
                        borderRadius: '50%',
                        border: '3px solid red'

                    }}>
                    </Box>
                    May Personal Expense
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    gap:6,
                    paddingLeft: 2
                }}>
                    <Chart value = {200} totValue= {1000} name={''} size = {120} font={15} />
                    <Box sx={{
                        display : 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography>
                            Total transaction : {totTransaction}
                        </Typography>
                        <Typography>
                            Top Category : {category}
                        </Typography>
                        <Typography>
                            Total Spent: {totSpent} /-
                        </Typography>
                    </Box>
                </Box>


                <Box sx={{ display:'flex',
                    justifyContent:'space-evenly',
                    padding: 2
                }}>
                    <Typography>
                        Category : {'Personal'}
                    </Typography>
                    <Typography>
                        Last Updated on: {lastUpdated}
                    </Typography>
                </Box>
            </Card>

            <Card sx={{width: '90%'  , border: 'solid #A1A3AB 2px', borderRadius: 2 , margin: '1rem auto'}}>
                <Typography sx={{display: 'flex', alignItems: 'center' , padding: 1, gap: 1}}>
                    <Box sx={{
                        height: '1rem',
                        width:'1rem',
                        borderRadius: '50%',
                        border: '3px solid red'

                    }}>
                    </Box>
                    May Group Expense
                </Typography>
                <Box sx={{display: 'flex',
                    justifyContent:'space-evenly'
                }}>
                    <Box sx={{
                    display: 'flex',
                    flexDirection:'column',
                    justifyContent: 'start',
                    alignItems: 'center',
                    
                    paddingLeft: 2
                }}>
                    <Chart value = {800} totValue= {1000} name={'Team A'} size = {120} font={15} />
                    <Typography fontSize={10}>
                        Your Contribution : {} /-
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection:'column',
                    justifyContent: 'start',
                    alignItems: 'center',
                    
                    paddingLeft: 2
                }}>
                    <Chart value = {200} totValue= {1000} name={'Team B'} size = {120} font={15} />
                    <Typography fontSize={10}>
                        Your Contribution : {} /-
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection:'column',
                    justifyContent: 'start',
                    alignItems: 'center',
                    
                    paddingLeft: 2
                }}>
                    <Chart value = {600} totValue= {1000} name={'Team C'} size = {120} font={15} />
                    <Typography fontSize={10}>
                        Your Contribution : {} /-
                    </Typography>
                </Box>
                </Box>


                <Box sx={{ display:'flex',
                    justifyContent:'space-evenly',
                    padding: 2
                }}>
                    <Typography>
                        Category : {}
                    </Typography>
                    <Typography>
                        Last Updated on: {}
                    </Typography>
                </Box>
            </Card>
            
            </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default PersonalTracker;
//#endregion