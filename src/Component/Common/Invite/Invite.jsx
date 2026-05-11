//#region imports
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Members from "./Members";
import { useDispatch } from "react-redux";
import { getSentRequests, sendInvitation } from "../../../redux/requestSlice";
import { searchUser } from "../../../redux/groupSlice";
import FullScreenLoader from "../Loader/FullScreenLoader";
import { toast } from "react-toastify";
//#endregion

const API_BASE_URL = "http://localhost:3000";

//#region Function Component
const Invite = ({ openInvite, handleClose, group }) => {
  //#region Component states
  const dispatch = useDispatch();
  const [pendingInvitation, setPendingInvitation] = useState([]);
  const [owner, setOwner] = useState(null);
  const [email, setEmail] = useState("");
  const [dummyName, setDummyName] = useState("");
  const [dummyMembers, setDummyMembers] = useState(group?.dummyMembers || []);
  const [memberTab, setMemberTab] = useState("members"); // "members" | "pending" | "dummy"
  const [mode, setMode] = useState("invite"); // "invite" | "dummy"
  const [loading, setLoading] = useState(false);
  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    if (!openInvite || !group?._id) return;

    const handlePendingRequest = async () => {
      const res = await dispatch(getSentRequests(group._id)).unwrap();
      const pendingRequest = res?.sentInvitations?.map(
        (invitation) => invitation.invitedTo,
      );
      setPendingInvitation(pendingRequest || []);
      setOwner(group.createdBy._id);
    };

    handlePendingRequest();
    setDummyMembers(group?.dummyMembers || []);
  }, [
    dispatch,
    group._id,
    openInvite,
    group.createdBy._id,
    group?.dummyMembers,
  ]);
  //#endregion

  //#region Component Api methods

  const handleInvitation = async () => {
    try {
      setLoading(true);
      const res = await dispatch(searchUser(email)).unwrap();
      await dispatch(
        sendInvitation({ groupId: group._id, invitedTo: res.user._id }),
      ).unwrap();
      setPendingInvitation((prev) => [...prev, res.user]);
      setEmail("");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // error handled by redux slice toast
    } finally {
      setLoading(false);
    }
  };

  const handleAddDummy = async () => {
    if (!dummyName.trim()) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/group/add-dummy/${group._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: dummyName.trim() }),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result?.message || "Failed to add dummy user");
        return;
      }
      toast.success(`"${dummyName.trim()}" added as dummy user`);
      setDummyMembers(result.dummyMembers);
      setDummyName("");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //#endregion

  //#region Component feature methods

  const getTabData = () => {
    if (memberTab === "members") return { data: group.members, isDummy: false };
    if (memberTab === "pending")
      return { data: pendingInvitation, isDummy: false };
    if (memberTab === "dummy") return { data: dummyMembers, isDummy: true };
    return { data: [], isDummy: false };
  };

  const { data: formateData, isDummy } = getTabData();

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
          width: { xs: "92vw", sm: "70vw" },
          height: "80vh",
          backgroundColor: "white",
          borderRadius: { xs: 1, sm: 2 },
          boxShadow: 24,
          py: 3,
          px: 1.5,
          overflow: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {loading && <FullScreenLoader />}

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Manage Members</Typography>
          <Typography
            onClick={handleClose}
            color="primary"
            sx={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Go Back
          </Typography>
        </Box>

        {/* Mode Toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "start" },
            gap: 1,
            mt: 2,
          }}
        >
          <Button
            size="medium"
            variant={mode === "invite" ? "contained" : "outlined"}
            onClick={() => setMode("invite")}
            sx={{
              textTransform: "none",
              backgroundColor: mode === "invite" ? "#f44336" : "#fff",
              color: mode === "invite" ? "#fff" : "#000",
              border: `1px solid ${mode !== "invite" && "#f44336"}`,
            }}
          >
            Invite Member
          </Button>
          <Button
            size="medium"
            variant={mode === "dummy" ? "contained" : "outlined"}
            onClick={() => setMode("dummy")}
            sx={{
              textTransform: "none",
              backgroundColor: mode === "dummy" ? "#f44336" : "fff",
              color: mode === "dummy" ? "#fff" : "#000",
              border: `1px solid ${mode !== "dummy" && "#f44336"}`,
            }}
          >
            Add Dummy User
          </Button>
        </Box>

        {/* Invite by Email */}
        {mode === "invite" && (
          <Box sx={{ display: "flex", gap: 2, my: 2 }}>
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
              disabled={!email}
              onClick={handleInvitation}
            >
              Invite
            </Button>
          </Box>
        )}

        {/* Add Dummy User */}
        {mode === "dummy" && (
          <Box sx={{ display: "flex", gap: 2, my: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Dummy User Name"
              value={dummyName}
              onChange={(e) => setDummyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddDummy()}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#f44336", width: "20%" }}
              disabled={!dummyName.trim()}
              onClick={handleAddDummy}
            >
              Add
            </Button>
          </Box>
        )}

        {/* Tabs */}
        <Box my={2}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              borderBottom: "1px solid #e0e0e0",
              pb: 1,
              mb: 1,
            }}
          >
            {[
              { key: "members", label: `Members(${group.members.length})` },
              {
                key: "pending",
                label: `Requests(${pendingInvitation.length})`,
              },
              { key: "dummy", label: `Dummy(${dummyMembers.length})` },
            ].map((tab) => (
              <Typography
                key={tab.key}
                variant="subtitle1"
                fontWeight="bold"
                onClick={() => setMemberTab(tab.key)}
                sx={{
                  cursor: "pointer",
                  opacity: memberTab !== tab.key ? 0.4 : 1,
                  borderBottom:
                    memberTab === tab.key ? "2px solid #f44336" : "none",
                  pb: 0.5,
                }}
              >
                {tab.label}
              </Typography>
            ))}
          </Box>

          {/* Dummy users list */}
          {isDummy ? (
            dummyMembers.length === 0 ? (
              <Typography variant="body2" color="text.secondary" mt={2}>
                No dummy users added yet.
              </Typography>
            ) : (
              dummyMembers.map((dummy, index) => (
                <Box
                  key={dummy._id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1.2,
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "#ffe0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: "#f44336",
                      fontSize: 14,
                    }}
                  >
                    {dummy.name?.charAt(0).toUpperCase()}
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {dummy.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dummy User
                    </Typography>
                  </Box>
                </Box>
              ))
            )
          ) : (
            // Real members / pending list
            formateData.map((user, index) => (
              <Members
                key={index}
                user={user}
                owner={owner}
                index={index}
                memberTab={memberTab === "members"}
              />
            ))
          )}
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
