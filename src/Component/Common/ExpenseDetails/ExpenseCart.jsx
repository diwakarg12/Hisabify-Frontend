
//#region imports
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const ExpenseCart = ({ item , index , onSelectExpense , selectedExpenseId}) => {
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
  const handleListCardClick = () => {
    onSelectExpense(item.id)
    // selectedExpenseId(item.id);
  }
  //#endregion

  //#region Component renders
  return(
    <Card
            key={ index}
            variant="outlined"
            onClick={handleListCardClick}
            sx={{
              borderLeft: `5px solid ${item.categoryColor}`,
              boxShadow: 'none',
              border : item.id === selectedExpenseId ? `2px solid ${item.categoryColor}` : ''
            }}
            
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={0.5} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {item.description}
                <Card sx={{
                  padding: 1,
                  backgroundColor: '#D9D9D9'
                }}>
                  {item.price}
                </Card>
              </Typography>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mt={1.5}
              >
                <Typography variant="caption">
                  Category:{' '}
                  <Box
                    component="span"
                    sx={{ color: item.categoryColor, fontWeight: 500 }}
                  >
                    {item.category}
                  </Box>
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Added on: {item.date}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
);
  //#endregion
}
//#endregion

//#region Component export
export default ExpenseCart;
//#endregion