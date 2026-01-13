//#region imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const TeamCart = ({ teamDetail, setOpenInvite, setOpenAddExpense }) => {
  const {
    _id,
    groupName,
    members,
    totalAmount,
    topCategory,
    yourContribution,
    latestExpense,
  } = teamDetail;
  const navigate = useNavigate();
  //#region Component states
  // const navigate = useNavigate()
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

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return (
    <Card
      variant="outlined"
      onClick={() => navigate(`/group-expense/${_id}`)}
      sx={{
        borderRadius: 3,
        padding: {
          xs: 0,
          sm: 1,
        },
        bgcolor: "#F5F8FF",
        border: "solid #A1A3AB 2px",
        marginBottom: 2,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          {groupName ? groupName : "Unknown"}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: 18,
            mb: 0.5,
          }}
        >
          Total Spend : {totalAmount ? totalAmount : 0}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: 18,
            mb: 0.5,
          }}
        >
          Top Category :{}
          <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
            {topCategory?.category ? topCategory?.category : "NA"}
          </Box>
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: 18,
            mb: 0.5,
          }}
        >
          Your Contribution : {yourContribution ? yourContribution : 0}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: 18,
            mb: {
              xs: 1,
              sm: 2,
            },
          }}
        >
          Last Transaction :{" "}
          {latestExpense
            ? new Date(latestExpense).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "NA"}
        </Typography>

        <Box
          sx={{
            display: {
              xs: "block",
              sm: "flex",
            },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={-1} sx={{ mb: { xs: 2, sm: 0 } }}>
            {members?.map((member, index) => (
              <Avatar
                key={index}
                src={member.profile}
                sx={{
                  border: "2px solid white",
                  width: 32,
                  height: 32,
                  zIndex: members.length - index,
                }}
              />
            ))}
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "end",
                sm: "start",
              },
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<GroupAddIcon />}
              onClick={(e) => setOpenInvite(e, _id)}
              sx={{ borderRadius: 3, textTransform: "none", color: red[400] }}
            >
              Invite
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<GroupAddIcon />}
              onClick={(e) => setOpenAddExpense(e, _id)}
              sx={{ borderRadius: 3, textTransform: "none", color: red[400] }}
            >
              Add Expense
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
  //#endregion
};
//#endregion

//#region Component export
export default TeamCart;
//#endregion
