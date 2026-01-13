//#region imports
import { PendingActionsOutlined } from "@mui/icons-material";
import { Box, Card, Typography, Link } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";
import Chart from "../Chart_Graph/Chart";
import { useNavigate } from "react-router-dom";
import { getExpenseAnalytics } from "../../../helpers/expenseAnalytics";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const PersonalTracker = ({ user, setOpenAddExpense, expenses, teamCards }) => {
  //#region Component states
  const navigate = useNavigate();
  const month = new Date().toLocaleString("default", { month: "short" });
  const { totalAmount, topCategory, biggestExpense, latestExpense } =
    getExpenseAnalytics(expenses);
  //#endregion

  //#region Component hooks

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
        width: "100%",
        padding: {
          xs: 0.5,
          sm: 1,
        },
        borderRadius: 2,
        boxShadow: 3,
        overflow: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        Personal Tracker
      </Typography>

      <Link
        sx={{
          display: "flex",
          textDecoration: "underline",
          width: {
            xs: "98%",
            sm: "95%",
            md: "90%",
          },
          margin: "0 auto",
          gap: 1,
        }}
      >
        <PendingActionsOutlined sx={{ color: "#A1A3AB" }} />
        <Typography
          onClick={(e) => setOpenAddExpense(e, user._id)}
          sx={{
            color: red[300],
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Add Expense
        </Typography>
      </Link>

      <Card
        sx={{
          width: {
            xs: "98%",
            sm: "95%",
            md: "90%",
          },
          border: "solid #A1A3AB 2px",
          bgcolor: "#F5F8FF",
          borderRadius: 2,
          margin: "1rem auto",
          paddingY: {
            md: 2,
          },
          paddingX: {
            md: 1,
          },
          cursor: "pointer",
        }}
        onClick={() => navigate("/myexpense")}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 1,
            gap: 1,
            fontWeight: 550,
            fontSize: 18,
          }}
        >
          <Box
            component="span"
            sx={{
              height: "1rem",
              width: "1rem",
              borderRadius: "50%",
              border: "3px solid red",
            }}
          ></Box>
          {month} Personal Expense
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            justifyContent: "start",
            alignItems: {
              xs: "start",
              sm: "center",
            },
            gap: {
              xs: 0,
              sm: 6,
            },
            paddingLeft: 2,
          }}
        >
          <Box
            sx={{
              alignSelf: {
                xs: "center",
                sm: "flex-start",
              },
              marginRight: {
                xs: "3rem",
                sm: 0,
              },
            }}
          >
            <Chart
              value={totalAmount}
              totValue={user?.income}
              name={`${((totalAmount / user?.income) * 100).toFixed(2)} %`}
              size={130}
              font={15}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontSize: 19 }}>
              Top transaction : {biggestExpense ? biggestExpense : 0}
            </Typography>
            <Typography sx={{ fontSize: 19 }}>
              Top Category : {topCategory ? topCategory?.category : "NA"}
            </Typography>
            <Typography sx={{ fontSize: 19 }}>
              Total Spent: {totalAmount ? totalAmount : 0} /-
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: {
              xs: "block",
              sm: "flex",
            },
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Typography sx={{ fontSize: { sm: 12, md: 15 } }}>
            Top Category : {topCategory ? topCategory?.category : "NA"}
          </Typography>
          <Typography sx={{ fontSize: { sm: 12, md: 15 } }}>
            Last Updated on:{" "}
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
        </Box>
      </Card>

      <Card
        sx={{
          width: "90%",
          border: "solid #A1A3AB 2px",
          borderRadius: 2,
          margin: "1rem auto",
          display: {
            xs: "none",
            md: "block",
          },
          paddingY: {
            md: 2,
          },
          paddingX: {
            md: 1,
          },
          overflowX: "auto",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 1,
            gap: 1,
            fontSize: 18,
            fontWeight: 550,
          }}
        >
          <Box
            component="span"
            sx={{
              height: "1rem",
              width: "1rem",
              borderRadius: "50%",
              border: "3px solid red",
            }}
          ></Box>
          {month} Groups Expenses
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          {teamCards && teamCards.length > 0 ? (
            teamCards?.map((group) => (
              <Box
                key={group?._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "center",

                  paddingLeft: 2,
                }}
              >
                <Chart
                  value={group?.yourContribution ? group?.yourContribution : 0}
                  totValue={group?.totalAmount ? group?.totalAmount : 0}
                  name={group.groupName}
                  size={120}
                  font={15}
                />
                <Typography fontSize={10}>
                  Your Contribution :{" "}
                  {group?.yourContribution ? group?.yourContribution : 0}
                  /-
                </Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ fontSize: 22, fontWeight: 600, my: 3 }}>
              You Don't have any group
            </Typography>
          )}
        </Box>
      </Card>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default PersonalTracker;
//#endregion
