
//#region imports
import { Box } from '@mui/material';
import React, { useState } from 'react';
import ExpenseList from '../../Common/ExpenseDetails/ExpenseList';
import ExpenseDetails from '../../Common/ExpenseDetails/ExpenseDetails';
import { Key } from '@mui/icons-material';
//#endregion

//#region Component make Styles
//#endregion

//#region interfaces & types
//#endregion

//#region Function Component
const ExpenseListPage:React.FC = () => {
  //#region Component states
  // const [expenseDetails , setExpenseDetails] = useState(null);
  const [selectedExpenseId , setSelectedExpenseId] = useState(1);
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
   const teamExpenses = [
    {
      id:1,
      title: 'Burger Point',
      description: 'Paid 3 Burger Price nd 2 soft coke',
      category: 'Food',
      categoryColor: 'red',
      date: '13/04/2025',
      price:'210'
    },
    {
        id:2,
      title: 'Trends',
      description: 'Purchased a Shirt at reliance store',
      category: 'Clothing',
      categoryColor: 'blue',
      date: '20/06/2023',
      price:'210',
      paid_by: 'harsh'
    },
     {
        id:3,
      title: 'Burger Point',
      description: 'Paid 3 Burger Price nd 2 soft coke',
      category: 'Food',
      categoryColor: 'red',
      date: '13/04/2025',
      price:'210',
      paid_by: 'harsh'
    },
    {
        id:4,
      title: 'Trends',
      description: 'Purchased a Shirt at reliance store',
      category: 'Clothing',
      categoryColor: 'blue',
      date: '20/06/2023',
      price:'210',
      paid_by: 'harsh'
    },
     {
        id:5,
      title: 'Burger Point',
      description: 'Paid 3 Burger Price nd 2 soft coke',
      category: 'Food',
      categoryColor: 'red',
      date: '13/04/2025',
      price:'210',
      paid_by: 'harsh'
    },
    {
        id:6,
      title: 'Trends',
      description: 'Purchased a Shirt at reliance store',
      category: 'Clothing',
      categoryColor: 'blue',
      date: '20/06/2023',
      price:'210',
      paid_by: 'harsh'
    },
  ];
  //#endregion

  //#region Component renders
  return(
    <Box sx={{
        display: 'flex',
        width:'100%',
        justifyContent: 'flex-start',
        gap: 4,
        height:'90vh'
    }}>
        <Box sx={{
            width: '50%',
            overflow: 'auto',
            marginBottom:'1.5rem',
            '&::-webkit-scrollbar': {
            display: 'none',
        },
        }}>
            <ExpenseList expenseList={teamExpenses} onSelectExpense={(id) => setSelectedExpenseId(id)} selectedExpenseId={selectedExpenseId} />
        </Box>

    {selectedExpenseId !== null && (
        <Box sx={{
        width: '50%',
    }}>
      <ExpenseDetails expense={teamExpenses.find((item) => item.id === selectedExpenseId)} />
    </Box>
    )}
        
    </Box>
  );
  //#endregion
}
//#endregion

//#region Component export
export default ExpenseListPage;
//#endregion