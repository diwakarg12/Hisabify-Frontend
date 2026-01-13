//#region imports
import { Box, Button, Card } from "@mui/material";
import React, { useState } from "react";
import TeamListCart from "../../Common/TeamListCart/TeamListCart";
import GroupsIcon from "@mui/icons-material/Groups";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseAnalytics } from "../../../helpers/expenseAnalytics";
import DeleteModal from "../../Common/DeleteModal/DeleteModal";
import { deleteGroup, getAllGroup } from "../../../redux/groupSlice";
// import { getExpenses } from "../../../redux/expenseSlice";
import AddTeam from "../../Common/AddTeam/AddTeam";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const TeamList = () => {
  //#region Component states
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);
  const groups = useSelector((store) => store.group.groups);
  const groupExpenses = useSelector((store) => store.expense.groupExpenses);

  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [deletableGroupId, setDeletableGroupId] = useState(null);
  const [editableData, setEditableData] = useState(null);

  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.
    dispatch(getAllGroup());
    // groups.forEach((group) => {
    //   dispatch(getExpenses(group._id));
    // });
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, [dispatch, groups]);

  //#endregion
  const groupCards = groups?.map((group) => {
    const expenses = groupExpenses[group?._id] || [];
    const summary = getExpenseAnalytics(expenses, { userId: user?._id });

    return {
      groupId: group?._id,
      groupName: group?.groupName,
      ...summary,
    };
  });
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  const handleOpenEditGroup = (e, id) => {
    const group = groups.find((group) => group?._id === id);
    setEditableData(group);
    e.stopPropagation();
    setDeletableGroupId(id);
    setOpenEdit(true);
  };

  const handleOpenDeleteGroup = (e, id) => {
    e.stopPropagation();
    setDeletableGroupId(id);
    setOpenDelete(true);
  };

  const handleDeleteGroup = async () => {
    setOpenDelete(false);
    dispatch(deleteGroup(deletableGroupId));
  };
  //#endregion

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  // const teamDetails = [
  //   {
  //     teamName: "Trip to patbna",
  //     totAmount: 1000,
  //     topCategory: "shoping",
  //     yourContribution: 200,
  //     lastTransaction: 400,
  //   },
  //   {
  //     teamName: "hajipur expense",
  //     totAmount: 1000,
  //     topCategory: "shoping",
  //     yourContribution: 200,
  //     lastTransaction: 400,
  //   },
  //   {
  //     teamName: "Team C",
  //     totAmount: 1000,
  //     topCategory: "shoping",
  //     yourContribution: 200,
  //     lastTransaction: 400,
  //   },
  //   {
  //     teamName: "Team D",
  //     totAmount: 1000,
  //     topCategory: "shoping",
  //     yourContribution: 200,
  //     lastTransaction: 400,
  //   },
  // ];
  //#endregion

  //#region Component renders
  return (
    <Box
      sx={{
        position: "relative",
        paddingBottom: "4rem",
      }}
    >
      <Button
        variant="outlined"
        size="large"
        startIcon={<GroupsIcon />}
        onClick={() => setOpenAddGroup(true)}
        sx={{
          textTransform: "none",
          backgroundColor: "#ff6467",
          color: "white",
          position: "fixed",
          top: {
            xs: "6.75rem",
            md: "6rem",
          },
          right: {
            xs: "1rem",
            md: "3rem",
          },
          boxShadow: 3,
          fontWeight: 600,
          zIndex: 1000,
        }}
      >
        Add Team
      </Button>

      <Card>
        {groupCards.map((teamDetail) => (
          <TeamListCart
            key={teamDetail?.groupId}
            teamDetail={teamDetail}
            handleOpenDeleteGroup={handleOpenDeleteGroup}
            handleOpenEditGroup={handleOpenEditGroup}
          />
        ))}
      </Card>

      {openDelete && (
        <DeleteModal
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          deletableId={deletableGroupId}
          handleDelete={handleDeleteGroup}
          title={"Group"}
        />
      )}

      {openEdit && (
        <AddTeam
          onClose={() => setOpenEdit(false)}
          user={user}
          editableData={editableData}
        />
      )}

      {openAddGroup && (
        <AddTeam user={user} onClose={() => setOpenAddGroup(false)} />
      )}
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default TeamList;
//#endregion
