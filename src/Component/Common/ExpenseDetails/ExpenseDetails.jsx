
//#region imports
import { Avatar, Box, Card, CardContent, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import { Delete , EditSquare } from '@mui/icons-material';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const ExpenseDetails = ({ expense }) => {
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
     <Card
      variant="outlined"
      sx={{
        p: 5,
        backgroundColor: '#f6f9fc',
        border: '1px solid #ddd',
        margin: '0 auto',
        height: '86vh'
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          variant="rounded"
          src={expense.imageUrl}
          sx={{ width: 64, height: 64 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {expense.title}
          </Typography>
          <Typography variant="body2" >
            Category : {' '}
            <Box
              component="span"
              sx={{ color: expense.categoryColor }}>
              {expense.category}
            </Box>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Added on: {expense.date}
          </Typography>
        </Box>
      </Stack>

      <CardContent sx={{ px: 0 , height: '100%', display:'flex' , flexDirection: 'column', justifyContent:'space-between'}}>

        <Stack spacing={1} mt={2}>
          <Typography variant="body2">
            <strong>Amount :</strong> Rs {expense.price} /-
          </Typography>
          <Typography variant="body2">
            <strong>Expense Title:</strong> {expense.title}
          </Typography>
          <Typography variant="body2">
            <strong>Expense Description:</strong> {expense.description}
          </Typography>
          <Typography variant="body2">
            <strong>Paid By:</strong> {expense.paid_by}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={3} pb={4}>
          <IconButton sx={{ color: "white" , backgroundColor: "#e57373",
            '&:hover': {
              backgroundColor: 'red', 
            },
          }}>
            <Delete />
          </IconButton>
          <IconButton sx={{ color: "white" , backgroundColor: "#e57373",
            '&:hover': {
              backgroundColor: 'red', 
            },
          }}>
            <EditSquare />
          </IconButton>
        </Stack>

      </CardContent>
    </Card>
  );
  //#endregion
}
//#endregion

//#region Component export
export default ExpenseDetails;
//#endregion