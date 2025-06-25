
//#region imports
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import MultiChart from '../Chart_Graph/MultiChart';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const TeamListCart = ({teamDetails}) => {
    const {teamName ,totAmount ,topCategory ,yourContribution ,lastTransaction} = teamDetails
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

  //#region Component JSX.members
 
  //#endregion

  //#region Component renders
  return(
    <Box sx={{display: 'flex',flexDirection: 'column' ,padding:2 , gap: 1 , alignItems: 'center', borderBottom: 'solid #d1d5db 4px' }}>
        <Typography variant="h5" fontSize={
            {
                xs: '1rem',
                sm: '1.5rem',
                md: '1.75rem',
                lg: '2rem',
                xl: '3rem',
            }
        } sx={{display: 'flex' ,justifyContent: 'center'}}>
                {teamName} 
        </Typography>
            
       <Card sx={{display:'flex' , boxShadow: 5, width:'90%' , gap: 10}}>

            <CardContent sx={{}}>
                <Typography variant="h6" >
                <strong>Total Spend :</strong> {totAmount}
                </Typography>

                <Typography variant="h6" >
                <strong>Top Category :</strong>{' '}
                <Box component="span" sx={{ color: 'error.main', fontWeight: 600 }}>
                    {topCategory}
                </Box>
                </Typography>

                <Typography variant="h6" >
                <strong>Top Spend :</strong> {yourContribution}
                </Typography>

                <Typography variant="h6" >
                <strong>Top Contribution:</strong> {yourContribution}
                </Typography>

                <Typography variant="h6" >
                <strong>Last Contribution :</strong> {lastTransaction}
                </Typography>

            </CardContent>
        

            <Box sx={{display: 'flex', gap:6 }}>
                <MultiChart data={data} outerRadius={80}/>
                <MultiChart data={datacategory} outerRadius={80}/>
            </Box>

       </Card>

    </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default TeamListCart;
//#endregion