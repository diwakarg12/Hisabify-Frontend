//#region imports
import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import {
  EXPENSE_CATEGORY_COLORS,
  DEFAULT_EXPENSE_COLOR,
} from "../../../helpers/expenseCategoryColors";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const ExpenseCart = ({ item, index, onSelectExpense, selectedExpenseId }) => {
  //#region Component states
  //#endregion
  const color = EXPENSE_CATEGORY_COLORS[item.category] || DEFAULT_EXPENSE_COLOR;
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
  const handleListCardClick = () => {
    onSelectExpense(item._id);
    // selectedExpenseId(item.id);
  };
  //#endregion

  //#region Component renders
  return (
    <Card
      key={index}
      variant="outlined"
      onClick={handleListCardClick}
      sx={{
        borderLeft: `5px solid ${color?.color}`,
        boxShadow: "none",
        border:
          item?._id === selectedExpenseId ? `2px solid ${color?.color}` : "",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ color: color?.color }}
        >
          {item?.category}
        </Typography>

        <Box
          variant="body2"
          color="text.secondary"
          mt={0.5}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {item?.description.length > 20
            ? item?.description.slice(0, 20) + "..."
            : item?.description}
          <Card
            sx={{
              padding: 1,
              backgroundColor: "#D9D9D9",
            }}
          >
            {item?.amount}
          </Card>
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={1.5}
        >
          <Typography variant="caption" color="text.secondary">
            Added on:{" "}
            {new Date(item?.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
  //#endregion
};
//#endregion

//#region Component export
export default ExpenseCart;
//#endregion
