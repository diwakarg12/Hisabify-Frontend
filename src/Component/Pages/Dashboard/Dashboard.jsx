/* eslint-disable react-hooks/exhaustive-deps */
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
import { addExpense, getExpenses } from "../../../redux/expenseSlice";
import { getExpenseAnalytics } from "../../../helpers/expenseAnalytics";

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
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [flag, setFlag] = useState("");
  //#endregion

  const dispatch = useDispatch();

  const user = useSelector((store) => store.auth.user);
  const groups = useSelector((store) => store.group.groups);
  const personalExpenses = useSelector(
    (store) => store.expense.personalExpenses
  );
  const groupExpenses = useSelector((store) => store.expense.groupExpenses);
  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount
    dispatch(getAllGroup());
    dispatch(getExpenses());
  }, [dispatch]);

  React.useEffect(() => {
    if (!groups.length) return;
    groups.forEach((group) => {
      dispatch(getExpenses(group?._id));
    });
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, [dispatch, groups?.length]);
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

  const openExpenseDialog = (e, id) => {
    e.stopPropagation();
    setOpenAddExpense(true);

    const isPersonal = String(id) === String(user._id);
    if (isPersonal) {
      setselectedData([user]);
      setFlag("personal");
      setSelectedGroupId(null);
    } else {
      const group = groups.find((g) => String(g._id) === String(id));
      setselectedData(group.members);
      setFlag("group");
      setSelectedGroupId(group._id);
    }
  };

  const handleAddExpense = async (data) => {
    if (flag === "personal") {
      await dispatch(addExpense({ data: data })).unwrap();
    } else {
      await dispatch(
        addExpense({ data: data, groupId: selectedGroupId })
      ).unwrap();
    }
  };

  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods

  const teamCards = groups?.map((teamDetail) => {
    const expenses = groupExpenses[teamDetail?._id] || [];

    const summary = getExpenseAnalytics(expenses, { userId: user?._id });

    return {
      _id: teamDetail?._id,
      groupName: teamDetail?.groupName,
      members: teamDetail?.members,
      ...summary,
    };
  });

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
            setOpenAddExpense={openExpenseDialog}
            expenses={personalExpenses}
            teamCards={teamCards}
          />
          <TeamTracker
            teamDetails={groups}
            setCreateTeam={setCreateTeam}
            setOpenInvite={handleInviteButtonClick}
            setOpenAddExpense={openExpenseDialog}
            groupExpenses={groupExpenses}
            teamCards={teamCards}
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
          flag={flag}
          handleAddExpense={handleAddExpense}
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
