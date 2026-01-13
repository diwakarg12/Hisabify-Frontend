//#region imports
import { Box, Typography, Stack } from "@mui/material";
import React, { useState } from "react";
import ExpenseDetails from "../../Common/ExpenseDetails/ExpenseDetails";
import ExpenseCart from "../../Common/ExpenseDetails/ExpenseCart";
//#endregion

//#region Component make Styles
//#endregion

//#region interfaces & types
//#endregion

//#region Function Component
const ExpenseList = ({
  title,
  expenses = [],
  handleOpenEditExpense,
  handleOpenDeleteExpense,
}) => {
  //#region Component states
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  //#endregion

  //#region Component hooks

  React.useEffect(() => {
    // Anything in here is fired on component update.
    if (expenses?.length) {
      setSelectedExpenseId(expenses[0]._id);
    }
  }, [expenses]);
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
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        width: "100%",
        justifyContent: "flex-start",
        gap: 4,
        height: "90vh",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "50%",
          },
          overflow: "auto",
          marginBottom: "1.5rem",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
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
            <Box
              component="span"
              sx={{ borderBottom: "3px solid red", pr: 0.5 }}
            >
              {title}
            </Box>{" "}
            Expense
          </Typography>

          <Stack spacing={2}>
            {expenses.length === 0 && (
              <Typography>No expenses found</Typography>
            )}
            {expenses?.map((item, index) => (
              <ExpenseCart
                key={index}
                item={item}
                index={index}
                onSelectExpense={(id) => setSelectedExpenseId(id)}
                selectedExpenseId={selectedExpenseId}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {selectedExpenseId !== null && (
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "50%",
            },
          }}
        >
          <ExpenseDetails
            expense={expenses?.find((item) => item._id === selectedExpenseId)}
            handleOpenEditExpense={handleOpenEditExpense}
            handleOpenDeleteExpense={handleOpenDeleteExpense}
          />
        </Box>
      )}
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default ExpenseList;
//#endregion
