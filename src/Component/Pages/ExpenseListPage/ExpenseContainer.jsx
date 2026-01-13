//#region imports
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";
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
import { toast } from "react-toastify";
import { getExpenseAnalytics } from "../../../helpers/expenseAnalytics";
import ExpenseList from "./ExpenseList";
import { useParams } from "react-router-dom";
import DeleteModal from "../../Common/DeleteModal/DeleteModal";

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const ExpenseContainer = () => {
  //#region Component states
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const group = useSelector((store) => store.group.groups).filter(
    (g) => g?._id === groupId
  );
  const expenses = useSelector((store) =>
    groupId
      ? store.expense.groupExpenses[groupId] || []
      : store.expense.personalExpenses || []
  );
  const [toggleChart, settoggleChart] = useState(false);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [openDeleteExpense, setOpenDeleteExpense] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [deletableId, setEditableId] = useState(null);
  const { totalAmount, topCategory, biggestExpense, latestExpense } =
    getExpenseAnalytics(expenses);

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
    try {
      if (isEdit) {
        await dispatch(editExpense({ data, expenseId })).unwrap();
      } else {
        if (groupId) {
          await dispatch(addExpense({ data: data, groupId: groupId })).unwrap();
        } else {
          await dispatch(addExpense({ data: data })).unwrap();
        }
      }
    } catch (error) {
      toast.error(error);
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
      })
    ).unwrap();
  };
  //#endregion

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  const data = [
    { label: "Group A", value: 400, color: "#0088FE" },
    { label: "Group B", value: 300, color: "#00C49F" },
    { label: "Group C", value: 300, color: "#FFBB28" },
    { label: "Group D", value: 200, color: "#FF8042" },
  ];

  const datacategory = [
    { label: "Shoping", value: 400, color: "#0088FE" },
    { label: "Study", value: 300, color: "#00C49F" },
    { label: "Phone", value: 300, color: "#FFBB28" },
    { label: "Misscellenous", value: 200, color: "#FF8042" },
    { label: "Shoping", value: 400, color: "#0088FE" },
  ];
  //#endregion

  //#region Component renders
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: {
          xs: "0.25rem",
          md: "2rem",
        },
        gap: 2,
      }}
    >
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          boxShadow: 13,
        }}
      >
        <img
          alt="profile"
          src={user?.profile}
          style={{
            height: "3rem",
            width: "3rem",
          }}
        />
        <Typography
          variant="h5"
          fontSize={{
            xs: "1rem",
            sm: "1.5rem",
            md: "1.75rem",
            lg: "2rem",
            xl: "3rem",
          }}
          sx={{}}
        >
          {groupId ? "Group Expense" : `'${user?.firstName}s Expense`}
        </Typography>
        <Button
          variant="outlined"
          size="medium"
          // startIcon={<GroupsIcon />}
          onClick={() => setOpenAddExpense(true)}
          sx={{
            textTransform: "none",
            backgroundColor: "#ff6467",
            color: "white",
            boxShadow: 3,
            fontWeight: 600,
            marginRight: 2,
          }}
        >
          Add Expense
        </Button>
      </Card>

      <Card
        sx={{
          border: "2px solid green",
          display: "flex",
          flexDirection: "column",
          alignItems: {
            xs: "center",
            md: "start",
            lg: "center",
          },

          boxShadow: 5,
          // height: "65vh",
        }}
      >
        {/* Buttons Pane */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            padding: {
              xs: "0.5rem",
              md: "1rem",
            },
            gap: {
              xs: 1,
              md: 6,
            },
            borderBottom: "solid #d1d5db 3px",
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
                boxShadow: 3,
                fontWeight: 600,
              }}
            >
              {toggleChart ? "Category Chart" : "Group Chart"}
            </Button>
          )}

          <DropDownButton />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: {
              xs: 2,
              md: 6,
            },
            overflowY: "auto",
            padding: {
              xs: 3,
              md: 4,
            },
          }}
        >
          <CardContent>
            {!groupId && (
              <Typography variant="h6">
                <strong>Monthly Income :</strong> {user?.income}
              </Typography>
            )}
            <Typography variant="h6">
              <strong>Monthly Spend :</strong> {totalAmount ? totalAmount : 0}
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
              <strong>Top Spend :</strong> {biggestExpense ? biggestExpense : 0}
            </Typography>

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

          <MultiChart
            data={toggleChart ? data : datacategory}
            outerRadius={100}
          />
        </Box>
      </Card>
      <Card
        sx={{
          padding: 2,
          boxShadow: 13,
          borderRadius: 1.5,
        }}
      >
        <ExpenseList
          title={groupId ? "group" : "Personal"}
          expenses={expenses}
          handleOpenEditExpense={handleOpenEditExpense}
          handleOpenDeleteExpense={handleOpenDeleteExpense}
        />
      </Card>

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
};
//#endregion

//#region Component export
export default ExpenseContainer;
//#endregion
