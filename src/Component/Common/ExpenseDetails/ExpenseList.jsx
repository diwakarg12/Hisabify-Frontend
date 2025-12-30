//#region imports
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";
import ExpenseCart from "./ExpenseCart";
//#endregion

//#region Component make Styles
//#endregion

//#region interfaces & types
//#endregion

//#region Function Component
const ExpenseList = ({
  title,
  expenseList,
  onSelectExpense,
  selectedExpenseId,
}) => {
  //#region Component states
  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, []);

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
  return (
    <Box
      p={5}
      sx={{
        backgroundColor: "#f6f9fc",
        border: "1px solid #ddd",
        margin: "0 auto",
        overflow: "auto",
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        <Box component="span" sx={{ borderBottom: "3px solid red", pr: 0.5 }}>
          {title}
        </Box>{" "}
        Expense
      </Typography>

      <Stack spacing={2}>
        {expenseList.map((item, index) => (
          <ExpenseCart
            key={index}
            item={item}
            index={index}
            onSelectExpense={onSelectExpense}
            selectedExpenseId={selectedExpenseId}
          />
        ))}
      </Stack>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default ExpenseList;
//#endregion
