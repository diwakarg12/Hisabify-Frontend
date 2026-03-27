//#region imports
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { AddCard } from "@mui/icons-material";
import React, { useState, useMemo } from "react";
import MultiChart from "../../Common/Chart_Graph/MultiChart";
import DropDownButton from "../../Common/DropDownButton/DropDownButton";
import { useDispatch, useSelector } from "react-redux";
import AddExpense from "../../Common/AddExpense/AddExpense";
import {
  addExpense,
  deleteExpense,
  editExpense,
  getExpenses,
} from "../../../redux/expenseSlice";
import { getExpenseAnalytics } from "../../../helpers/expenseAnalytics";
import { getCategoryChartData } from "../../../helpers/getCategoryChartData";
import ExpenseList from "./ExpenseList";
import { useParams } from "react-router-dom";
import DeleteModal from "../../Common/DeleteModal/DeleteModal";
import { getGroupExpenseChartData } from "../../../helpers/getGroupExpenseChartData";
import FullScreenLoader from "../../Common/Loader/FullScreenLoader";

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const ExpenseContainer = () => {
  //#region Component states
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const currentDate = new Date();
  const user = useSelector((store) => store.auth.user);
  const groups = useSelector((store) => store.group.groups);
  const group = groups?.filter((g) => g?._id === groupId);
  const { expenses, expenseLoading } = useSelector((store) => {
    const expenseState = store.expense;

    return {
      expenses: groupId
        ? expenseState.groupExpenses[groupId] || []
        : expenseState.personalExpenses || [],
      expenseLoading: expenseState.expenseLoading,
    };
  });
  const groupExpenses = useSelector((store) => store?.expense?.groupExpenses);
  const [toggleChart, settoggleChart] = useState(false);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [openDeleteExpense, setOpenDeleteExpense] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [deletableId, setEditableId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const groupExpenseChartData = getGroupExpenseChartData(
    groupExpenses,
    groups,
    user?._id,
  );

  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    if (groupId) {
      dispatch(getExpenses(groupId));
    } else {
      dispatch(getExpenses());
    }
  }, [groupId, dispatch]);

  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  const handleAddExpense = async (data, isEdit, expenseId) => {
    if (isEdit) {
      await dispatch(editExpense({ data, expenseId })).unwrap();
    } else {
      if (groupId) {
        await dispatch(addExpense({ data: data, groupId: groupId })).unwrap();
      } else {
        await dispatch(addExpense({ data: data })).unwrap();
      }
    }
  };

  const handleOpenEditExpense = async (id) => {
    const expense = expenses.find((expense) => expense._id === id);
    setEditableData(expense);
    setOpenAddExpense(true);
  };

  const handleOpenDeleteExpense = (id) => {
    setEditableId(id);
    setOpenDeleteExpense(true);
  };

  const handleDeleteExpense = async () => {
    setOpenDeleteExpense(false);
    await dispatch(
      deleteExpense({
        expenseId: deletableId,
        isPersonal: expenses.find((expense) => expense?._id === deletableId)
          ?.isPersonal,
        groupId: groupId || null,
      }),
    ).unwrap();
  };
  //#endregion

  //#region Component feature methods
  // 🔥 Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const date = new Date(expense.date);

      return (
        date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
      );
    });
  }, [expenses, selectedMonth, selectedYear]);

  console.log("filteredExpenses :", filteredExpenses);

  const {
    totalAmount,
    topCategory,
    biggestExpense,
    latestExpense,
    yourContribution,
    yourShare,
  } = getExpenseAnalytics(filteredExpenses, { userId: user?._id });
  const categoryChartData = getCategoryChartData(filteredExpenses);

  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: {
          xs: 1,
          md: 1.5,
        },
        // height: "88vh",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        overflowY: "hidden",
      }}
    >
      {expenseLoading && <FullScreenLoader />}

      <Button
        variant="outlined"
        size="medium"
        startIcon={<AddCard />}
        onClick={() => setOpenAddExpense(true)}
        sx={{
          position: "absolute",
          bottom: { xs: 60, md: 15 },
          right: { xs: 0, md: 20 },
          textTransform: "none",
          backgroundColor: "#ff6467",
          color: "white",
          boxShadow: 3,
          fontWeight: 600,
          marginRight: 2,
          width: 150,
        }}
      >
        Add Expense
      </Button>

      <Box
        flex={1}
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: {
              xs: "center",
              md: "start",
              lg: "center",
            },

            boxShadow: 5,
            border: "2px solid red",
          }}
        >
          {/* Buttons Pane */}

          <Box
            sx={{
              display: "flex",
              width: {
                xs: "100%",
                md: "95%",
              },
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: {
                xs: 2,
                md: 2,
              },

              padding: 1,
            }}
          >
            <CardContent>
              <DropDownButton
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
              {!groupId && (
                <Typography variant="h6">
                  <strong>Monthly Income :</strong> {user?.income}
                </Typography>
              )}
              <Typography variant="h6">
                <strong>Total Spend :</strong> {totalAmount ? totalAmount : 0}
              </Typography>

              <Typography variant="h6">
                <strong>Top Category :</strong>{" "}
                <Box
                  component="span"
                  sx={{ color: "error.main", fontWeight: 600 }}
                >
                  {topCategory?.category ? topCategory?.category : "NA"}
                </Box>
              </Typography>

              <Typography variant="h6">
                <strong>Top Spend :</strong>{" "}
                {biggestExpense ? biggestExpense : 0}
              </Typography>

              {groupId && (
                <>
                  <Typography variant="h6">
                    <strong>Your Contribution :</strong>{" "}
                    {yourContribution ? yourContribution : 0}
                  </Typography>

                  <Typography variant="h6">
                    <strong>Your Expense Share :</strong>{" "}
                    {yourShare ? yourShare : 0}
                  </Typography>
                </>
              )}

              <Typography variant="h6">
                <strong>Last Transaction:</strong>{" "}
                {latestExpense
                  ? new Date(latestExpense).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
              </Typography>
            </CardContent>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: groupId ? 10 : 0,
              }}
            >
              {!groupId && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    settoggleChart(!toggleChart);
                  }}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#ff6467",
                    color: "white",
                    width: "50%",
                    boxShadow: 3,
                    fontWeight: 600,
                    margin: {
                      xs: "0 0 1% 10%",
                      md: "0 0 2% 8%",
                    },
                  }}
                >
                  {"Toggle Chart"}
                </Button>
              )}
              <MultiChart
                data={toggleChart ? groupExpenseChartData : categoryChartData}
                outerRadius={100}
              />
            </Box>
          </Box>
        </Card>
        <Card
          sx={{
            padding: 2,
            boxShadow: 13,
            borderRadius: 1.5,
            marginTop: 1,
          }}
        >
          <ExpenseList
            title={groupId ? "group" : "Personal"}
            expenses={filteredExpenses}
            handleOpenEditExpense={handleOpenEditExpense}
            handleOpenDeleteExpense={handleOpenDeleteExpense}
          />
        </Card>
      </Box>

      {openAddExpense && (
        <AddExpense
          openAddExpense={openAddExpense}
          setOpenAddExpense={setOpenAddExpense}
          data={groupId ? group[0].members : [user]}
          flag={groupId ? "group" : "personal"}
          handleAddExpense={handleAddExpense}
          editableData={editableData}
        />
      )}
      {openDeleteExpense && (
        <DeleteModal
          openDelete={openDeleteExpense}
          setOpenDelete={setOpenDeleteExpense}
          deletableId={deletableId}
          handleDelete={handleDeleteExpense}
          title={"Expense"}
        />
      )}
    </Box>
  );
  //#endregion
};;
//#endregion

//#region Component export
export default ExpenseContainer;
//#endregion
