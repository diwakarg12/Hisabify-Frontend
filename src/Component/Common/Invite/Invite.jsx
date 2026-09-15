//#region imports
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SendIcon from "@mui/icons-material/Send";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { useState, useEffect } from "react";
import Members from "./Members";
import { useDispatch, useSelector } from "react-redux";
import { getSentRequests, sendInvitation, reviewReceivedRequest } from "../../../redux/requestSlice";
import { searchUser, removeUser, removeDummyUser, getAllGroup } from "../../../redux/groupSlice";
import FullScreenLoader from "../Loader/FullScreenLoader";
import { useGlobalLoader } from "../Loader/GlobalLoaderContext";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config/Api";
//#endregion

const Invite = ({ openInvite, handleClose, group }) => {
  //#region Component states
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [pendingInvitation, setPendingInvitation] = useState([]);
  const [owner, setOwner] = useState(null);
  
  // Search and invite queue states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [usersToInvite, setUsersToInvite] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Dummy user states
  const [dummyName, setDummyName] = useState("");
  const [dummyMembers, setDummyMembers] = useState(group?.dummyMembers || []);

  // UI Modes and Tabs
  const [memberTab, setMemberTab] = useState("members"); // "members" | "pending" | "dummy"
  const [mode, setMode] = useState("invite"); // "invite" | "dummy"
  const [loading, setLoading] = useState(false);
  //#endregion

  //#region Component hooks
  useEffect(() => {
    if (!openInvite || !group?._id) return;

    const handlePendingRequest = async () => {
      try {
        const res = await dispatch(getSentRequests(group._id)).unwrap();
        const pendingRequest = res?.sentInvitations?.map((invitation) => ({
          ...(invitation.invitedTo || {}),
          invitationId: invitation._id,
        }));
        setPendingInvitation(pendingRequest || []);
        setOwner(group.createdBy?._id || group.createdBy);
      } catch (err) {
        setPendingInvitation([]);
      }
    };

    handlePendingRequest();
    setDummyMembers(group?.dummyMembers || []);
    setUsersToInvite([]);
    setSearchResults([]);
    setSearchQuery("");
    setHasSearched(false);
  }, [dispatch, group?._id, openInvite, group?.createdBy, group?.dummyMembers]);
  //#endregion

  //#region User Search & Invite API Methods
  const handleUserSearch = async () => {
    if (!searchQuery.trim()) {
      toast.info("Please enter a name or email to search");
      return;
    }
    try {
      setIsSearching(true);
      setHasSearched(true);
      const res = await dispatch(searchUser(searchQuery.trim())).unwrap();
      const users = res?.users || (res?.user ? [res.user] : []);
      setSearchResults(users);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUserSearch();
    }
  };

  const handleAddUserToQueue = (userToAdd) => {
    if (!userToAdd || !userToAdd._id) return;
    if (usersToInvite.some((u) => u._id === userToAdd._id)) {
      toast.info("User already in invitation queue");
      return;
    }
    setUsersToInvite((prev) => [...prev, userToAdd]);
  };

  const handleRemoveUserFromQueue = (userId) => {
    setUsersToInvite((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleSendAllInvitations = async () => {
    if (usersToInvite.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(
        usersToInvite.map((user) =>
          dispatch(
            sendInvitation({ groupId: group._id, invitedTo: user._id })
          ).unwrap()
        )
      );

      setPendingInvitation((prev) => [...prev, ...usersToInvite]);
      setUsersToInvite([]);
      setSearchResults([]);
      setSearchQuery("");
      setHasSearched(false);
      setMemberTab("pending");
    } catch (err) {
      // toast error handled in slice
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
        }
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result?.message || "Failed to add dummy user");
        return;
      }
      toast.success(`"${dummyName.trim()}" added as dummy user`);
      setDummyMembers(result.dummyMembers);
      setDummyName("");
      setMemberTab("dummy");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  const isGroupOwner = Boolean(
    currentUser?._id && owner && String(currentUser._id) === String(owner)
  );

  const handleRemoveMember = async (userId) => {
    if (!isGroupOwner) return;
    try {
      setLoading(true);
      await dispatch(removeUser({ groupId: group._id, userId })).unwrap();
      dispatch(getAllGroup());
    } catch (err) {
      // toast error handled in slice
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDummy = async (dummyId) => {
    if (!isGroupOwner) return;
    try {
      setLoading(true);
      const res = await dispatch(removeDummyUser({ groupId: group._id, dummyId })).unwrap();
      setDummyMembers(res.dummyMembers || []);
      dispatch(getAllGroup());
    } catch (err) {
      // toast error handled in slice
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    if (!invitationId || !isGroupOwner) return;
    try {
      setLoading(true);
      await dispatch(
        reviewReceivedRequest({
          status: "cancelled",
          requestId: invitationId,
          groupId: group._id,
        })
      ).unwrap();
      setPendingInvitation((prev) =>
        prev.filter((inv) => inv.invitationId !== invitationId && inv._id !== invitationId)
      );
    } catch (err) {
      // toast error handled in thunk
    } finally {
      setLoading(false);
    }
  };

  //#region Tab Data Helper
  const getTabData = () => {
    if (memberTab === "members") return { data: group?.members || [], isDummy: false };
    if (memberTab === "pending")
      return { data: pendingInvitation, isDummy: false };
    if (memberTab === "dummy") return { data: dummyMembers, isDummy: true };
    return { data: [], isDummy: false };
  };

  const { data: formateData, isDummy } = getTabData();
  //#endregion

  return (
    <Modal
      open={openInvite}
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(15, 23, 42, 0.65)",
      }}
    >
      <Fade in={openInvite}>
        <Paper
          elevation={24}
          sx={{
            width: { xs: "92vw", sm: "80vw", md: "620px" },
            maxHeight: "88vh",
            borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          {loading && <FullScreenLoader />}

          {/* Modal Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #269685 0%, #176054 100%)",
              color: "#FFFFFF",
              px: 3,
              py: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  width: 42,
                  height: 42,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 12px rgba(23, 96, 84, 0.4)",
                }}
              >
                <GroupAddIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  Manage Members
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {group?.groupName || "Group Members & Invitations"}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={handleClose}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box
            sx={{
              p: 3,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#CBD5E1",
                borderRadius: "3px",
              },
            }}
          >
            {/* Owner vs Non-Owner Action Section */}
            {!isGroupOwner ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  bgcolor: "#E6F4F1",
                  border: "1px solid #B2E2D9",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <InfoOutlinedIcon sx={{ color: "#1F7A6C", fontSize: 24 }} />
                <Box>
                  <Typography variant="body2" fontWeight={700} color="#176054">
                    Restricted Management
                  </Typography>
                  <Typography variant="caption" color="#1F7A6C" display="block">
                    Only the group owner can search, invite, or add new members/dummy users.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                {/* Mode Switcher Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "#F1F5F9",
                    p: 0.5,
                    borderRadius: "12px",
                    gap: 0.5,
                  }}
                >
                  <Button
                    fullWidth
                    size="small"
                    startIcon={<PersonOutlineIcon />}
                    onClick={() => setMode("invite")}
                    sx={{
                      borderRadius: "9px",
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      ...(mode === "invite"
                        ? {
                            bgcolor: "#FFFFFF",
                            color: "#1F7A6C",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                          }
                        : { color: "#64748B", "&:hover": { color: "#1E293B" } }),
                    }}
                  >
                    Invite Real User
                  </Button>
                  <Button
                    fullWidth
                    size="small"
                    startIcon={<SmartToyIcon />}
                    onClick={() => setMode("dummy")}
                    sx={{
                      borderRadius: "9px",
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      ...(mode === "dummy"
                        ? {
                            bgcolor: "#FFFFFF",
                            color: "#1F7A6C",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                          }
                        : { color: "#64748B", "&:hover": { color: "#1E293B" } }),
                    }}
                  >
                    Add Dummy User
                  </Button>
                </Box>

                {/* Invite Real User Form */}
                {mode === "invite" && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 0.8 }}>
                      Search Players by Name or Email
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        placeholder="Search by name or email (e.g. harsh, har, rkyharsu...)"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (hasSearched) setHasSearched(false);
                        }}
                        onKeyDown={handleKeyDownSearch}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: "#94A3B8" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": { borderColor: "#1F7A6C" },
                            "&.Mui-focused fieldset": { borderColor: "#1F7A6C" },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        disabled={isSearching || !searchQuery.trim()}
                        onClick={handleUserSearch}
                        sx={{
                          bgcolor: "#1F7A6C",
                          color: "#FFFFFF",
                          borderRadius: "10px",
                          px: 2.5,
                          textTransform: "none",
                          fontWeight: 600,
                          boxShadow: "0 4px 10px rgba(31, 122, 108, 0.3)",
                          "&:hover": { bgcolor: "#176054" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isSearching ? <CircularProgress size={20} color="inherit" /> : "Search"}
                      </Button>
                    </Box>

                    {/* Search Results Dropdown */}
                    {hasSearched && (
                      <Paper
                        variant="outlined"
                        sx={{
                          mt: 1,
                          p: 1.5,
                          borderRadius: "12px",
                          bgcolor: "#F8FAFC",
                          maxHeight: "180px",
                          overflowY: "auto",
                          borderColor: "#E2E8F0",
                        }}
                      >
                        {searchResults.length === 0 ? (
                          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 1 }}>
                            No users found matching "{searchQuery}"
                          </Typography>
                        ) : (
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                              Matching Users ({searchResults.length}):
                            </Typography>
                            {searchResults.map((foundUser) => {
                              const isAlreadyMember = group?.members?.some((m) => m._id === foundUser._id);
                              const isAlreadyInvited = pendingInvitation.some((p) => p._id === foundUser._id);
                              const isQueued = usersToInvite.some((u) => u._id === foundUser._id);

                              return (
                                <Box
                                  key={foundUser._id}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 1,
                                    borderRadius: "8px",
                                    bgcolor: "#FFFFFF",
                                    border: "1px solid #F1F5F9",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Avatar
                                      src={foundUser.profile}
                                      sx={{ width: 34, height: 34, bgcolor: "#1F7A6C", fontSize: 14 }}
                                    >
                                      {foundUser.firstName?.charAt(0)}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.2 }}>
                                        {foundUser.firstName} {foundUser.lastName}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {foundUser.email}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  {isAlreadyMember ? (
                                    <Chip label="Member" size="small" variant="outlined" sx={{ borderRadius: "6px" }} />
                                  ) : isAlreadyInvited ? (
                                    <Chip label="Invited" size="small" color="warning" variant="outlined" sx={{ borderRadius: "6px" }} />
                                  ) : (
                                    <Button
                                      size="small"
                                      variant={isQueued ? "outlined" : "contained"}
                                      disabled={isQueued}
                                      onClick={() => handleAddUserToQueue(foundUser)}
                                      startIcon={isQueued ? <CheckIcon /> : <PersonAddIcon />}
                                      sx={{
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        fontSize: "0.75rem",
                                        py: 0.4,
                                        px: 1.5,
                                        ...(isQueued
                                          ? { borderColor: "#10B981", color: "#10B981" }
                                          : { bgcolor: "#1F7A6C", color: "#FFF", "&:hover": { bgcolor: "#176054" } }),
                                      }}
                                    >
                                      {isQueued ? "Queued" : "Add"}
                                    </Button>
                                  )}
                                </Box>
                              );
                            })}
                          </Box>
                        )}
                      </Paper>
                    )}

                    {/* Queued Users to Invite */}
                    {usersToInvite.length > 0 && (
                      <Box sx={{ mt: 1.5, p: 1.5, bgcolor: "#E6F4F1", borderRadius: "12px", border: "1px solid #B2E2D9" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="caption" fontWeight={700} color="#176054">
                            To Invite ({usersToInvite.length} Selected):
                          </Typography>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={handleSendAllInvitations}
                            startIcon={<SendIcon style={{ fontSize: 14 }} />}
                            sx={{
                              bgcolor: "#1F7A6C",
                              color: "#FFF",
                              borderRadius: "8px",
                              textTransform: "none",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              "&:hover": { bgcolor: "#176054" },
                            }}
                          >
                            Send Invites
                          </Button>
                        </Box>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                          {usersToInvite.map((user) => (
                            <Chip
                              key={user._id}
                              avatar={
                                <Avatar src={user.profile} sx={{ bgcolor: "#1F7A6C" }}>
                                  {user.firstName?.charAt(0)}
                                </Avatar>
                              }
                              label={`${user.firstName} ${user.lastName || ""}`}
                              onDelete={() => handleRemoveUserFromQueue(user._id)}
                              sx={{
                                borderRadius: "10px",
                                bgcolor: "#FFFFFF",
                                color: "#176054",
                                fontWeight: 600,
                                border: "1px solid #B2E2D9",
                                "& .MuiChip-deleteIcon": {
                                  color: "#1F7A6C",
                                  "&:hover": { color: "#176054" },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Add Dummy User Form */}
                {mode === "dummy" && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 0.8 }}>
                      Add a Dummy Member (For record-keeping without email account)
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        placeholder="Enter dummy user name (e.g. Cash Expense, Driver, Guest)"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={dummyName}
                        onChange={(e) => setDummyName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddDummy()}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": { borderColor: "#1F7A6C" },
                            "&.Mui-focused fieldset": { borderColor: "#1F7A6C" },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        disabled={!dummyName.trim()}
                        onClick={handleAddDummy}
                        sx={{
                          bgcolor: "#1F7A6C",
                          color: "#FFFFFF",
                          borderRadius: "10px",
                          px: 2.5,
                          textTransform: "none",
                          fontWeight: 600,
                          boxShadow: "0 4px 10px rgba(31, 122, 108, 0.3)",
                          "&:hover": { bgcolor: "#176054" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        Add Dummy
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
            )}

            {/* Tabs for View List */}
            <Box sx={{ mt: 1 }}>
              <Box sx={{ borderBottom: 1, borderColor: "#E2E8F0" }}>
                <Tabs
                  value={memberTab}
                  onChange={(e, val) => setMemberTab(val)}
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    minHeight: 40,
                    "& .MuiTabs-indicator": { backgroundColor: "#1F7A6C", height: 3 },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      minHeight: 40,
                      color: "#64748B",
                      "&.Mui-selected": { color: "#1F7A6C" },
                    },
                  }}
                >
                  <Tab label={`Members (${group?.members?.length || 0})`} value="members" />
                  <Tab label={`Requests (${pendingInvitation.length})`} value="pending" />
                  <Tab label={`Dummy (${dummyMembers.length})`} value="dummy" />
                </Tabs>
              </Box>

              {/* List Rendering */}
              <Box sx={{ pt: 1, maxHeight: "240px", overflowY: "auto" }}>
                {isDummy ? (
                  dummyMembers.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                      No dummy users added yet.
                    </Typography>
                  ) : (
                    dummyMembers.map((dummy, index) => (
                      <Box
                        key={dummy._id || index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1.2,
                          px: 2,
                          my: 1,
                          borderRadius: "12px",
                          bgcolor: "#FFFFFF",
                          border: "1px solid #F1F5F9",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#E6F4F1",
                              color: "#1F7A6C",
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {dummy.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {dummy.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Dummy User (No account)
                            </Typography>
                          </Box>
                        </Box>

                        {/* Remove Dummy User Button (Owner Only) */}
                        {isGroupOwner && (
                          <Tooltip title="Remove dummy user">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveDummy(dummy._id)}
                              sx={{
                                color: "#EF4444",
                                bgcolor: "#FEF2F2",
                                border: "1px solid #FCA5A5",
                                "&:hover": { bgcolor: "#FEE2E2", color: "#DC2626" },
                                p: 0.6,
                              }}
                            >
                              <DeleteOutlineIcon style={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    ))
                  )
                ) : formateData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                    {memberTab === "members"
                      ? "No members in group yet."
                      : "No pending invitations sent."}
                  </Typography>
                ) : (
                  formateData.map((usr, index) => (
                    <Members
                      key={usr._id || index}
                      user={usr}
                      owner={owner}
                      index={index}
                      memberTab={memberTab === "members"}
                      currentUserId={currentUser?._id}
                      onRemoveMember={handleRemoveMember}
                      onCancelInvitation={handleCancelInvitation}
                    />
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default Invite;
