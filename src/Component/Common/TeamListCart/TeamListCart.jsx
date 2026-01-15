//#region imports
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import React from "react";
import MultiChart from "../Chart_Graph/MultiChart";
import { useNavigate } from "react-router-dom";
import { Delete, EditSquare } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getCategoryChartData } from "../../../helpers/getCategoryChartData";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const TeamListCart = ({
  teamDetail,
  handleOpenDeleteGroup,
  handleOpenEditGroup,
}) => {
  const {
    groupId,
    groupName,
    totalAmount,
    topCategory,
    biggestExpense,
    yourContribution,
    latestExpense,
    yourShare,
  } = teamDetail;
  //#region Component states
  //#endregion
  const navigate = useNavigate();
  const expenses = useSelector(
    (store) => store.expense.groupExpenses[groupId] || []
  );

  const categoryChartData = getCategoryChartData(expenses);

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
        flexDirection: "column",
        padding: {
          xs: 0,
          md: 2,
        },
        paddingTop: {
          xs: 1,
          md: 2,
        },
        paddingBottom: {
          xs: 1,
          md: 0,
        },
        gap: 1,
        alignItems: "center",
        borderBottom: "solid #d1d5db 3px",
      }}
    >
      <Typography
        variant="h5"
        fontSize={{
          xs: "1.30rem",
          sm: "1.5rem",
          md: "1.75rem",
          lg: "2rem",
          xl: "3rem",
        }}
        sx={{
          fontWeight: 600,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {groupName}
      </Typography>

      <Card
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          cursor: "pointer",
          WebkitOverflowScrolling: "touch",
          boxShadow: 5,
          marginBottom: {
            xs: 0.5,
            md: 2,
          },
          width: {
            xs: "95%",
            md: "90%",
          },
          overflow: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        onClick={() => navigate(`/group-expense/${groupId}`)}
      >
        <CardContent
          sx={{
            minWidth: { xs: 280, sm: 320, md: "45%" },
            flexShrink: 0,
          }}
        >
          <Typography variant="h6">
            <strong>Total Spend :</strong> {totalAmount ? totalAmount : 0}
          </Typography>
          <Typography variant="h6">
            <strong>Top Category: </strong>
            <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
              {topCategory?.category ? topCategory?.category : "NA"}
            </Box>
          </Typography>
          <Typography variant="h6">
            <strong>Your Contribution :</strong>{" "}
            {yourContribution ? yourContribution : 0}
          </Typography>
          <Typography variant="h6">
            <strong>Top Spend:</strong> {biggestExpense ? biggestExpense : 0}
          </Typography>
          <Typography variant="h6">
            <strong>Your Expense Share:</strong> {yourShare ? yourShare : 0}
          </Typography>
          <Typography variant="h6">
            <strong>Last Transaction :</strong>{" "}
            {latestExpense
              ? new Date(latestExpense).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "NA"}
          </Typography>
        </CardContent>

        <Box
          sx={{
            minWidth: { xs: 260, sm: 300, md: "40%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <MultiChart data={categoryChartData} outerRadius={80} />
        </Box>
        <Box
          sx={{
            minWidth: { xs: 100, sm: 120, md: "8%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
          }}
        >
          <IconButton
            sx={{
              color: "white",
              backgroundColor: "#e57373",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
            onClick={(e) => {
              handleOpenDeleteGroup(e, groupId);
            }}
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
            onClick={(e) => {
              handleOpenEditGroup(e, groupId);
            }}
          >
            <EditSquare />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default TeamListCart;
//#endregion
