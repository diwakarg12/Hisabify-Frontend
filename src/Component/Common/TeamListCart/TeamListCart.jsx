//#region imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import React from "react";
import MultiChart from "../Chart_Graph/MultiChart";
import { useNavigate } from "react-router-dom";
import {
  Delete,
  EditSquare,
  KeyboardDoubleArrowRight,
  KeyboardDoubleArrowLeft,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getCategoryChartData } from "../../../helpers/getCategoryChartData";
import { red } from "@mui/material/colors";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const TeamListCart = ({
  teamDetail,
  handleOpenDeleteGroup,
  handleOpenEditGroup,
  handleInviteButtonClick,
  isMobile,
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
    (store) => store.expense.groupExpenses[groupId] || [],
  );
  const cardRef = React.useRef(null);

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
  const handleRightArrowClick = (e) => {
    e.stopPropagation();

    if (cardRef.current) {
      cardRef.current.scrollBy({
        left: cardRef.current.offsetWidth * 1,
        behavior: "smooth",
      });
    }
  };

  const handleLeftArrowClick = (e) => {
    e.stopPropagation();

    if (cardRef.current) {
      cardRef.current.scrollBy({
        left: -cardRef.current.offsetWidth * 1,
        behavior: "smooth",
      });
    }
  };
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
        ref={cardRef}
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          cursor: "pointer",
          WebkitOverflowScrolling: "touch",
          boxShadow: 5,
          position: "relative",
          marginBottom: {
            xs: 0.5,
            md: 2,
          },
          width: {
            xs: "95%",
            md: "90%",
          },
          overflow: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        onClick={() =>
          navigate(`/group-expense/${groupId}`, {
            state: { groupName: groupName },
          })
        }
      >
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            cursor: "pointer",
          }}
          onClick={handleRightArrowClick}
        >
          {isMobile && (
            <KeyboardDoubleArrowRight
              sx={{ fontSize: "2.5rem", color: "#e57373" }}
            />
          )}
        </Box>
        <CardContent
          sx={{
            minWidth: { xs: "100%", sm: "45%" },
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
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={(e) => {
                handleOpenDeleteGroup(e, groupId);
              }}
              sx={{
                color: red[400],
                border: "1px solid #e57373",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#e57373",
                },
              }}
            >
              Delete
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={(e) => {
                handleOpenEditGroup(e, groupId);
              }}
              sx={{
                color: red[400],
                border: "1px solid #e57373",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#e57373",
                },
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={(e) => {
                handleInviteButtonClick(e, groupId);
              }}
              sx={{
                color: red[400],
                border: "1px solid #e57373",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#e57373",
                },
                
              }}
            >
              Invite
            </Button>
          </Box>
        </CardContent>
        <Box
          sx={{
            minWidth: { xs: "100%", sm: "55%" },
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 2,
              cursor: "pointer",
            }}
            onClick={handleLeftArrowClick}
          >
            {isMobile && (
              <KeyboardDoubleArrowLeft
                sx={{ fontSize: "2.5rem", color: "#e57373" }}
              />
            )}
          </Box>

          <MultiChart
            data={categoryChartData}
            outerRadius={100}
            rightMargin={5}
          />
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
