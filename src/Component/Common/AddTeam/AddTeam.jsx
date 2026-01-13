//#region imports
import React, { useRef, useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  createGroup,
  searchUser,
  updateGroup,
} from "../../../redux/groupSlice";
import { resetSearchUsers } from "../../../redux/groupSlice";
import { sendInvitation } from "../../../redux/requestSlice";
// import { sendInvitation } from "../../../redux/requestSlice";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const AddTeam = ({ onClose, user, editableData = null }) => {
  //#region Component states
  const contentRef = useRef(null);
  const dispatch = useDispatch();
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [teamDetails, setTeamDetails] = useState({
    groupName: "",
    description: "",
    members: [],
  });
  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Anything in here is fired on component unmount.
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  React.useEffect(() => {
    // Anything in here is fired on component update.

    if (editableData) {
      setTeamDetails(() => ({
        groupName: editableData.groupName,
        description: editableData.description,
        members: editableData.members,
      }));
      if (editableData?.members) {
        setInvitedMembers([...editableData.members]);
      }
    }
  }, [editableData]);
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  const handleUserSearch = async () => {
    const res = await dispatch(searchUser(email)).unwrap();
    setInvitedMembers([...invitedMembers, res.user]);
    setEmail("");
  };

  //#endregion

  //#region Component feature methods
  const handleTeamInputChange = (e) => {
    try {
      const { name, value } = e.target;
      setTeamDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    } catch (error) {
      console.log("Error: ", error?.message);
    }
  };

  const handleRemoveInvitedUser = (userId) => {
    setInvitedMembers((prev) => prev.filter((member) => member._id !== userId));
  };

  const handleCreateGroup = async () => {
    const finalGroupDetails = {
      ...teamDetails,
      createdBy: user._id,
      members: [],
    };
    const group = await dispatch(createGroup(finalGroupDetails)).unwrap();

    invitedMembers.map(
      async (member) =>
        await dispatch(
          sendInvitation({ groupId: group.group._id, invitedTo: member._id })
        ).unwrap()
    );

    setInvitedMembers([]);
    setTeamDetails({
      groupName: "",
      description: "",
      members: [],
    });

    dispatch(resetSearchUsers());

    onClose();
  };

  const handleEditGroup = () => {
    const data = {
      groupName: teamDetails?.groupName,
      description: teamDetails?.description,
    };
    console.log("updatedGroupDetails", data);
    dispatch(updateGroup({ data, groupId: editableData?._id }));
    setInvitedMembers([]);
    setTeamDetails({
      groupName: "",
      description: "",
      members: [],
    });
    onClose();
  };
  //#endregion

  //#region Component JSX.members

  //#endregion

  //#region Component renders
  return (
    <Box
      ref={contentRef}
      sx={{
        position: "fixed",
        top: {
          xs: "25vh",
          sm: "25vh",
          md: "25vh",
          lg: "25vh",
        },
        left: {
          xs: "3vh",
          sm: "4.75vh",
          md: "16vh",
          lg: "25vh",
        },
        width: {
          xs: "90vw",
          sm: "85vw",
          md: "75vw",
          lg: "70vw",
        },
        height: "60vh",
        backgroundColor: "#F9F9F9",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        padding: 3,
        // boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" gutterBottom>
          <Box
            component="span"
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#F24E1E",
            }}
          >
            {editableData?.groupName ? "Edit" : "Crreate"}
          </Box>
          <Box component="span">
            {" "}
            {editableData?.groupName ? "Team" : "New Team"}
          </Box>
        </Typography>
        <Button onClick={() => onClose()} sx={{ textDecoration: "underline" }}>
          Go BACk
        </Button>
      </Box>

      <Box
        sx={{
          backgroundColor: "#FFF",
          width: "100%",
          height: "90vh",
          p: "1rem",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          boxShadow: 3,
          borderRadius: 1,
        }}
      >
        <TextField
          label="Group Name"
          name="groupName"
          value={teamDetails.groupName}
          onChange={handleTeamInputChange}
          placeholder="Enter Group Name"
          variant="outlined"
          type="text"
          fullWidth
          size="small"
        />
        <TextField
          label="CreatedBy"
          name="createdBy"
          value={user.email}
          variant="outlined"
          size="small"
          type="email"
          fullWidth
          sx={{ marginTop: 2 }}
        />
        {invitedMembers.length > 0 && (
          <Stack
            sx={{
              margin: "0.9rem 0 0.4rem 0",
              color: "#FFF",
              display: "flex",
              flexWrap: "wrap",
            }}
            direction="row"
          >
            {invitedMembers.map((member, index) => (
              <Box
                key={index}
                component="span"
                sx={{
                  display: "flex",
                  gap: 0.6,
                  backgroundColor: "#F24E1E",
                  borderRadius: 0.5,
                  padding: "1px 2px",
                  margin: "2px",
                }}
              >
                {member && member.firstName}
                <Box
                  component="span"
                  sx={{
                    cursor: editableData ? "not-allowed" : "pointer",
                    pointerEvents: editableData ? "none" : "auto",
                    padding: "1px 2px",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                  disabled={editableData ? true : false}
                  onClick={() => handleRemoveInvitedUser(member._id)}
                >
                  X
                </Box>
              </Box>
            ))}
          </Stack>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: invitedMembers.length > 0 ? 0 : 1.5,
          }}
        >
          <TextField
            label="Add members"
            size="small"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            disabled={editableData ? true : false}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#F24E1E" }}
            disabled={editableData ? true : false}
            onClick={handleUserSearch}
          >
            Search
          </Button>
        </Box>

        <TextField
          label="Group Description"
          name="description"
          value={teamDetails.description}
          onChange={handleTeamInputChange}
          multiline
          size="small"
          rows={3}
          fullWidth
          variant="outlined"
          placeholder="Enter Group Description here..."
          sx={{ marginY: "1rem" }}
        />

        <Button
          variant="contained"
          size="large"
          sx={{ backgroundColor: "#F24E1E" }}
          onClick={editableData ? handleEditGroup : handleCreateGroup}
        >
          {editableData ? "Edit Group" : "Create Group"}
        </Button>
      </Box>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default AddTeam;
//#endregion
