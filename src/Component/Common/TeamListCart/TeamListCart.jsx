//#region imports
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import React from "react";
import MultiChart from "../Chart_Graph/MultiChart";
import { useNavigate } from "react-router-dom";
import { Delete, EditSquare } from "@mui/icons-material";
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
  } = teamDetail;
  //#region Component states
  //#endregion
  const navigate = useNavigate();

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

  const datacategory = [
    { label: "Shoping", value: 400, color: "#0088FE" },
    { label: "Study", value: 300, color: "#00C49F" },
    { label: "Phone", value: 300, color: "#FFBB28" },
    { label: "Misscellenous", value: 200, color: "#FF8042" },
    { label: "Shoping", value: 400, color: "#0088FE" },
  ];
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
        paddingBottom: {
          xs: 1,
          md: 0,
        },
        gap: 1,
        alignItems: "center",
        borderBottom: "solid #d1d5db 4px",
      }}
    >
      <Typography
        variant="h5"
        fontSize={{
          xs: "1.25rem",
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
          cursor: "pointer",
          boxShadow: 5,
          marginBottom: {
            xs: 0.5,
            md: 2,
          },
          width: {
            xs: "95%",
            md: "90%",
          },
          gap: 3,
          overflow: "auto",
          scrollbarWidth: "none",
        }}
        onClick={() => navigate(`/group-expense/${groupId}`)}
      >
        <CardContent sx={{ width: "45%" }}>
          <Typography
            variant="h6"
            sx={{
              width: {
                xs: "160%",
                md: "100%",
              },
            }}
          >
            <strong>Total Spend :</strong> {totalAmount ? totalAmount : 0}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              width: {
                xs: "200%",
                md: "100%",
              },
            }}
          >
            <strong>Top Category: </strong>
            <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
              {topCategory?.category ? topCategory?.category : "NA"}
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              width: {
                xs: "200%",
                md: "100%",
              },
            }}
          >
            <strong>Your Contribution :</strong>{" "}
            {yourContribution ? yourContribution : 0}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              width: {
                xs: "200%",
                md: "100%",
              },
            }}
          >
            <strong>Top Spend:</strong> {biggestExpense ? biggestExpense : 0}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              width: {
                xs: "200%",
                md: "100%",
              },
            }}
          >
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
            display: "flex",
            gap: 6,
            width: "40%",
          }}
        >
          <MultiChart data={datacategory} outerRadius={80} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            width: "8%",
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
