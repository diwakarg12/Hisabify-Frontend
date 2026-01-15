//#region imports
import { Box, Typography, Stack, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import ExpenseDetails from "../../Common/ExpenseDetails/ExpenseDetails";
import ExpenseCart from "../../Common/ExpenseDetails/ExpenseCart";
import { Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  console.log("isMobile", isMobile);

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
        overflowX: "hidden",
        width: "100%",
        justifyContent: "flex-start",
        gap: {
          xs: 0,
          md: 4,
        },
        height: "90vh",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "50%",
          },
          border: "2px solid red",
          marginBottom: "1.5rem",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f6f9fc",
            border: "1px solid #ddd",
            margin: "0 auto",
            overflow: "auto",
            padding: {
              xs: 1.5,
              md: 5,
            },
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            // sx={{
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            // }}
          >
            <Box component="span" sx={{ borderBottom: "3px solid red" }}>
              {title} Exp
            </Box>
            ense
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
                onSelectExpense={(id) => {
                  setSelectedExpenseId(id);

                  if (isMobile) {
                    setOpenDetailsModal(true);
                  }
                }}
                selectedExpenseId={selectedExpenseId}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {!isMobile && selectedExpenseId !== null && (
        <Box
          sx={{
            width: "50%",
          }}
        >
          <ExpenseDetails
            expense={expenses?.find((item) => item?._id === selectedExpenseId)}
            handleOpenEditExpense={handleOpenEditExpense}
            handleOpenDeleteExpense={handleOpenDeleteExpense}
          />
        </Box>
      )}

      {isMobile && (
        <Modal
          open={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              overflowY: "auto",
              top: "20%",
              p: 2,
            }}
          >
            {/* Close button */}
            <Box
              sx={{ backgroundColor: "#f6f9fc", padding: 1, borderRadius: 2 }}
            >
              <IconButton
                onClick={() => setOpenDetailsModal(false)}
                sx={{
                  position: "absolute",
                  top: 15,
                  right: 12,
                  zIndex: 10,
                }}
              >
                <CloseIcon sx={{ fontSize: 45 }} />
              </IconButton>

              <ExpenseDetails
                expense={expenses.find((e) => e._id === selectedExpenseId)}
                handleOpenEditExpense={handleOpenEditExpense}
                handleOpenDeleteExpense={handleOpenDeleteExpense}
              />
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default ExpenseList;
//#endregion
