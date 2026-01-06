//#region imports
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Members from "./Members";
import { useDispatch } from "react-redux";
import { getSentRequests, sendInvitation } from "../../../redux/requestSlice";
import { searchUser } from "../../../redux/groupSlice";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Invite = ({ openInvite, handleClose, group }) => {
  //#region Component states
  const dispatch = useDispatch();
  // const sentRequest = useSelector((store) => store.request.sentRequest);
  const [pendingInvitation, setPendingInvitation] = useState([]);
  const [owner, setOwner] = useState(null);
  const [email, setEmail] = useState("");
  const [memberTab, setMemberTab] = useState(true);
  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.

    if (!openInvite || !group?._id) return;

    const handlePendingRequest = async () => {
      const res = await dispatch(getSentRequests(group._id)).unwrap();
      const pendingRequest = res?.sentInvitations?.map(
        (invitation) => invitation.invitedTo
      );
      setPendingInvitation(pendingRequest || []);
      setOwner(group.createdBy._id);
    };
    handlePendingRequest();
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, [dispatch, group?._id, openInvite, group.createdBy._id]);
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods

  //#endregion

  //#region Component feature methods

  const handleInvitation = async () => {
    const res = await dispatch(searchUser(email)).unwrap();
    await dispatch(
      sendInvitation({ groupId: group._id, invitedTo: res.user._id })
    ).unwrap();

    setPendingInvitation((prev) => [...prev, res.user]);
    setEmail("");
  };

  //#endregion

  //#region Component JSX.members

  const formateData = memberTab ? group.members : pendingInvitation;
  //#endregion

  //#region Component renders
  return (
    <Modal open={openInvite} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "92vw",
            sm: "70vw",
          },
          height: "80vh",
          backgroundColor: "white",
          borderRadius: {
            xs: 1,
            sm: 2,
          },
          boxShadow: 24,
          py: 3,
          px: 1.5,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Invite new members</Typography>
          <Typography
            onClick={handleClose}
            color="primary"
            sx={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {" "}
            Go Back
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            my: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#f44336", width: "20%" }}
            onClick={handleInvitation}
          >
            Invite
          </Button>
        </Box>

        <Box my={2}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              onClick={() => setMemberTab(true)}
              sx={{ cursor: "pointer", opacity: !memberTab ? 0.6 : 1 }}
            >
              Members
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              onClick={() => setMemberTab(false)}
              sx={{ cursor: "pointer", opacity: memberTab ? 0.6 : 1 }}
            >
              Pending Requests
            </Typography>
          </Box>
          {formateData.map((user, index) => (
            <Members
              user={user}
              owner={owner}
              index={index}
              memberTab={memberTab}
            />
          ))}
        </Box>
      </Box>
    </Modal>
  );
  //#endregion
};
//#endregion

//#region Component export
export default Invite;
//#endregion
