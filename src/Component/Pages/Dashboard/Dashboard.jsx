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
  const [selectedGroup, setselectedGroup] = useState(null);
  const [selectedData, setselectedData] = useState(null);
  //#endregion

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const groups = useSelector((state) => state.group.groups);
  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.
    const fetchGroups = async () => {
      try {
        await dispatch(getAllGroup()).unwrap();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroups();
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, [dispatch]);

  React.useEffect(() => {
    // Anything in here is fired on component update.
  });
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  const handleInviteButtonClick = (e, groupId) => {
    e.stopPropagation();
    setOpenInvite(true);

    const group = groups.find((group) => String(group._id) === String(groupId));
    setselectedGroup(group);
  };

  const handleAddExpenseButtonButtonClick = (e, id) => {
    e.stopPropagation();
    setOpenAddExpense(true);
    const data =
      String(id) === String(user._id)
        ? user
        : groups.find((group) => String(group._id) === String(id));
    setselectedData(data);
  };
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
          Welcome Back {user ? `${user.firstName} ${user.lastName}` : "Guest"}
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
          <PersonalTracker
            user={user}
            setOpenAddExpense={handleAddExpenseButtonButtonClick}
          />
          <TeamTracker
            teamDetails={groups}
            setCreateTeam={setCreateTeam}
            setOpenInvite={handleInviteButtonClick}
            setOpenAddExpense={handleAddExpenseButtonButtonClick}
          />
        </Box>
      </Box>

      {/* Overlay */}
      {createTeam && (
        <AddTeam onClose={() => setCreateTeam(false)} user={user} />
      )}
      {openAddExpense && (
        <AddExpense
          openAddExpense={openAddExpense}
          setOpenAddExpense={setOpenAddExpense}
          data={selectedData}
        />
      )}
      {openInvite && (
        <Invite
          openInvite={openInvite}
          handleClose={() => setOpenInvite(false)}
          group={selectedGroup}
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
