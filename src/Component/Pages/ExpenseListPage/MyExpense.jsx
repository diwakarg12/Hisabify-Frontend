//#region imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TeamListCart from "../../Common/TeamListCart/TeamListCart";
import MultiChart from "../../Common/Chart_Graph/MultiChart";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DropDownButton from "../../Common/DropDownButton/DropDownButton";
import { useSelector } from "react-redux";
import AddExpense from "../../Common/AddExpense/AddExpense";
import ExpenseListPage from "./ExpenseListPage";

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const MyExpense = () => {
  //#region Component states
  const [toggleChart, settoggleChart] = useState(false);
  const [addExpense, setAddExpense] = useState(false);
  const user = useSelector((store) => store.auth.user);
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
  const personalExpenses = [
    {
      id: 1,
      title: "Burger Point",
      description: "Paid 3 Burger Price nd 2 soft coke",
      category: "Food",
      categoryColor: "red",
      date: "13/04/2025",
      price: "210",
    },
    {
      id: 2,
      title: "Trends",
      description: "Purchased a Shirt at reliance store",
      category: "Clothing",
      categoryColor: "blue",
      date: "20/06/2023",
      price: "210",
      paid_by: "harsh",
    },
    {
      id: 3,
      title: "Burger Point",
      description: "Paid 3 Burger Price nd 2 soft coke",
      category: "Food",
      categoryColor: "red",
      date: "13/04/2025",
      price: "210",
      paid_by: "harsh",
    },
    {
      id: 4,
      title: "Trends",
      description: "Purchased a Shirt at reliance store",
      category: "Clothing",
      categoryColor: "blue",
      date: "20/06/2023",
      price: "210",
      paid_by: "harsh",
    },
    {
      id: 5,
      title: "Burger Point",
      description: "Paid 3 Burger Price nd 2 soft coke",
      category: "Food",
      categoryColor: "red",
      date: "13/04/2025",
      price: "210",
      paid_by: "harsh",
    },
    {
      id: 6,
      title: "Trends",
      description: "Purchased a Shirt at reliance store",
      category: "Clothing",
      categoryColor: "blue",
      date: "20/06/2023",
      price: "210",
      paid_by: "harsh",
    },
  ];

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  const teamDetails = {
    teamName: "My Personal Expense",
    totAmount: 1000,
    topCategory: "shoping",
    yourContribution: 200,
    lastTransaction: 400,
  };

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
          src={user.profile}
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
          {`${user.firstName}'s Expense`}
        </Typography>
        <Button
          variant="outlined"
          size="medium"
          // startIcon={<GroupsIcon />}
          onClick={() => setAddExpense(true)}
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
          display: "flex",
          flexDirection: "column",
          boxShadow: 5,
          height: "65vh",
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
            {toggleChart ? "Group Chart" : "Category Chart"}
          </Button>

          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              backgroundColor: "#ff6467",
              color: "white",
              boxShadow: 3,
              fontWeight: 600,
            }}
          >
            Transactions
          </Button>

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
            padding: 4,
          }}
        >
          <CardContent>
            <Typography variant="h6">
              <strong>Total Monthly Income :</strong> {teamDetails.totAmount}
            </Typography>
            <Typography variant="h6">
              <strong>Total Monthly Spend :</strong> {teamDetails.totAmount}
            </Typography>

            <Typography variant="h6">
              <strong>Top Category :</strong>{" "}
              <Box
                component="span"
                sx={{ color: "error.main", fontWeight: 600 }}
              >
                {teamDetails.topCategory}
              </Box>
            </Typography>

            <Typography variant="h6">
              <strong>Top Spend :</strong> {teamDetails.yourContribution}
            </Typography>

            <Typography variant="h6">
              <strong>Last Transaction:</strong> {teamDetails.yourContribution}
            </Typography>
          </CardContent>

          <MultiChart
            data={toggleChart ? datacategory : data}
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
        <ExpenseListPage title={"Personal"} expense={personalExpenses} />
      </Card>

      {addExpense && (
        <AddExpense
          openAddExpense={addExpense}
          setOpenAddExpense={setAddExpense}
        />
      )}
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default MyExpense;
//#endregion
