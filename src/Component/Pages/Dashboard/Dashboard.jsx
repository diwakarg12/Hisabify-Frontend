//#region imports
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { yellow } from "@mui/material/colors";
import TeamTracker from "../../Common/TeamTracker/TeamTracker";
import PersonalTracker from "../../Common/PersonalTracker/PersonalTracker";
import AddTeam from "../../Common/AddTeam/AddTeam";
import AddExpense from "../../Common/AddExpense/AddExpense";
import Invite from "../../Common/Invite/Invite";
import { useSelector, useDispatch } from "react-redux";
import { getAllGroup } from "../../../redux/groupSlice";

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Dashboard = () => {
  //#region Component states
  const [createTeam, setCreateTeam] = useState(false);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  //#endregion

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const groups = useSelector((state) => state.group.groups);
  console.log("Groups", groups);
  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.
    const fetchGroups = async () => {
      try {
        const res = await dispatch(getAllGroup()).unwrap();
        console.log("Groups:", res);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroups();
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
  const handleInviteButtonClick = (e) => {
    e.stopPropagation();
    setOpenInvite(true);
  };
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  const teamDetails = [
    {
      id: 0,
      teamName: "Team A",
      totAmount: 1000,
      topCategory: "shoping",
      yourContribution: 200,
      lastTransaction: 400,
    },
    {
      id: 1,
      teamName: "Team B",
      totAmount: 1000,
      topCategory: "shoping",
      yourContribution: 200,
      lastTransaction: 400,
    },
    {
      id: 2,
      teamName: "Team A",
      totAmount: 1000,
      topCategory: "shoping",
      yourContribution: 200,
      lastTransaction: 400,
    },
    {
      id: 3,
      teamName: "Team B",
      totAmount: 1000,
      topCategory: "shoping",
      yourContribution: 200,
      lastTransaction: 400,
    },
  ];

  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return (
    <Box
      sx={{
        position: "relative",
        paddingBottom: "0rem",
        height: {
          md: "100%",
        },
        overflowY: "hidden",
      }}
    >
      {/* Dashboard Content */}
      <Box
        sx={{
          border: "2px solid red",
          backgroundColor: "#FFF",
          display: "flex",
          flexDirection: "column",
          height: {
            md: "100%",
          },
          borderRadius: {
            xs: 0,
            sm: 2,
          },
          pointerEvents: createTeam ? "none" : "auto",
          transition: "filter 0.3s ease",
          filter: createTeam || openAddExpense ? "blur(2px)" : "none",
        }}
      >
        <Typography
          sx={{
            padding: {
              xs: 1,
              sm: 2,
            },
            paddingBottom: {
              xs: 1,
              sm: 0,
            },
            fontSize: 20,
            fontWeight: 550,
          }}
        >
          Welcome Back {`${user.firstName} ${user.lastName && user.lastName}`}
          <WavingHandIcon sx={{ color: yellow[600], marginLeft: 2 }} />
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "center",
            padding: {
              xs: 0.5,
              sm: 2,
            },
            margin: {
              xs: 0.5,
              sm: 2,
            },
            marginTop: 0,
            gap: 2,
            // border: "solid 2px #A1A3AB",
            border: "solid 2px red",
            overflow: "auto",
            borderRadius: 2,
          }}
        >
          <PersonalTracker setOpenAddExpense={setOpenAddExpense} />
          <TeamTracker
            teamDetails={teamDetails}
            setCreateTeam={setCreateTeam}
            openInvite={openInvite}
            setOpenInvite={handleInviteButtonClick}
            handleClose={() => setOpenInvite(false)}
          />
        </Box>
      </Box>

      {/* Overlay */}
      {createTeam && <AddTeam onClose={() => setCreateTeam(false)} />}
      {openAddExpense && (
        <AddExpense
          openAddExpense={openAddExpense}
          setOpenAddExpense={setOpenAddExpense}
        />
      )}
      {openInvite && (
        <Invite
          openInvite={openInvite}
          handleClose={() => setOpenInvite(false)}
        />
      )}
    </Box>
  );
  //#endregion
};
//#endregions

//#region Component export
export default Dashboard;
//#endregion
