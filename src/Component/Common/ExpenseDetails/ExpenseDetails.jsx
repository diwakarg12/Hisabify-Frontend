//#region imports
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Delete, EditSquare } from "@mui/icons-material";
import {
  EXPENSE_CATEGORY_COLORS,
  DEFAULT_EXPENSE_COLOR,
} from "../../../helpers/expenseCategoryColors";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const ExpenseDetails = ({
  expense,
  handleOpenEditExpense,
  handleOpenDeleteExpense,
}) => {
  //#region Component states
  //#endregion
  const color =
    EXPENSE_CATEGORY_COLORS[expense?.category] || DEFAULT_EXPENSE_COLOR;
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
    <Card
      variant="outlined"
      sx={{
        p: { xs: 1, sm: 2, md: 5 },
        pt: { xs: 5, sm: 5, md: 5 },
        backgroundColor: "#f6f9fc",
        border: `2px solid ${color?.color}`,
        margin: "0 auto",
        height: { md: "86vh" },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          variant="rounded"
          src={expense?.receiptImage ? expense?.receiptImage : ""}
          sx={{ width: 64, height: 64 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {expense?.category}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Added on:{" "}
            {new Date(expense?.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        </Box>
      </Stack>

      <CardContent
        sx={{
          px: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={1} mt={2}>
          <Typography variant="body2">
            <strong>Amount :</strong> Rs {expense?.amount} /-
          </Typography>
          <Typography variant="body2">
            <strong>Expense Title:</strong> {expense?.category}
          </Typography>
          <Typography variant="body2">
            <strong>Expense Description:</strong> {expense?.description}
          </Typography>
          <Typography variant="body2">
            <strong>Paid By:</strong>{" "}
            {`${expense?.createdFor?.firstName} ${expense?.createdFor?.lastName}`}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          mt={3}
          pb={4}
        >
          <IconButton
            sx={{
              color: "white",
              backgroundColor: "#e57373",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
            onClick={() => handleOpenDeleteExpense(expense?._id)}
          >
            <Delete />
          </IconButton>
          <IconButton
            sx={{
              color: "white",
              backgroundColor: "#e57373",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
            onClick={() => handleOpenEditExpense(expense?._id)}
          >
            <EditSquare />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
  //#endregion
};
//#endregion

//#region Component export
export default ExpenseDetails;
//#endregion
