//#region imports
import { Box } from "@mui/material";
import React, { useState } from "react";
import ExpenseList from "../../Common/ExpenseDetails/ExpenseList";
import ExpenseDetails from "../../Common/ExpenseDetails/ExpenseDetails";
import { Key } from "@mui/icons-material";
import { useParams } from "react-router-dom";
//#endregion

//#region Component make Styles
//#endregion

//#region interfaces & types
//#endregion

//#region Function Component
const ExpenseListPage = ({ title, expense }) => {
  //#region Component states
  // const [expenseDetails , setExpenseDetails] = useState(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState(expense[0].id);
  const { groupId } = useParams();
  console.log("groupId:", groupId);
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
        <ExpenseList
          title={title}
          expenseList={expense}
          onSelectExpense={(id) => setSelectedExpenseId(id)}
          selectedExpenseId={selectedExpenseId}
        />
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
            expense={expense.find((item) => item.id === selectedExpenseId)}
          />
        </Box>
      )}
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default ExpenseListPage;
//#endregion
