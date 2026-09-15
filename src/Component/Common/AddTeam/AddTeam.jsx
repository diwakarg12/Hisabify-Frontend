//#region imports
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Chip,
  Paper,
  CircularProgress,
  InputAdornment,
  Fade,
  Modal,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import {
  createGroup,
  searchUser,
  updateGroup,
  resetSearchUsers,
} from "../../../redux/groupSlice";
import { sendInvitation } from "../../../redux/requestSlice";
import FullScreenLoader from "../Loader/FullScreenLoader";
import { useGlobalLoader } from "../Loader/GlobalLoaderContext";
import { toast } from "react-toastify";
//#endregion

const POPULAR_CATEGORIES = [
  { name: "Food & Dining", icon: "🍔" },
  { name: "Rent & Bills", icon: "🏠" },
  { name: "Travel & Fuel", icon: "🚗" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Medical", icon: "🏥" },
  { name: "Trip & Vacation", icon: "✈️" },
];

const AddTeam = ({ onClose, user, editableData = null }) => {
  //#region Component states
  const dispatch = useDispatch();
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamDetails, setTeamDetails] = useState({
    groupName: "",
    description: "",
  });

  const [selectedCategories, setSelectedCategories] = useState([
    "Food & Dining",
    "Rent & Bills",
    "Travel & Fuel",
    "Shopping",
    "Entertainment",
    "Medical",
  ]);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  //#endregion

  const initialCategoriesRef = React.useRef([]);

  //#region Component hooks
  useEffect(() => {
    if (editableData) {
      setTeamDetails({
        groupName: editableData.groupName || "",
        description: editableData.description || "",
      });
      const existing = editableData?.categories || [];
      initialCategoriesRef.current = existing;
      if (existing.length > 0) {
        setSelectedCategories([...existing]);
      }
      if (editableData?.members) {
        setInvitedMembers([...editableData.members]);
      }
    } else {
      initialCategoriesRef.current = [];
    }
  }, [editableData]);

  const handleToggleCategory = (catName) => {
    const isExisting = editableData && initialCategoriesRef.current.some(
      (c) => c.toLowerCase() === catName.toLowerCase()
    );

    if (isExisting) {
      toast.info(`"🔒 ${catName}" is an existing group category and cannot be removed to protect expense history.`);
      return;
    }

    if (selectedCategories.includes(catName)) {
      if (selectedCategories.length === 1) {
        toast.info("At least one category is required for the group");
        return;
      }
      setSelectedCategories((prev) => prev.filter((c) => c !== catName));
    } else {
      setSelectedCategories((prev) => [...prev, catName]);
    }
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;

    if (selectedCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(`"${trimmed}" category is already added`);
      setCustomCategoryInput("");
      return;
    }

    setSelectedCategories((prev) => [...prev, trimmed]);
    setCustomCategoryInput("");
  };

  const handleRemoveCustomCategory = (catName) => {
    const isExisting = editableData && initialCategoriesRef.current.some(
      (c) => c.toLowerCase() === catName.toLowerCase()
    );

    if (isExisting) {
      toast.info(`"🔒 ${catName}" is an existing group category and cannot be removed to protect expense history.`);
      return;
    }

    if (selectedCategories.length === 1) {
      toast.info("At least one category is required for the group");
      return;
    }
    setSelectedCategories((prev) => prev.filter((c) => c !== catName));
  };
  //#endregion

  //#region Search logic
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
    } catch (error) {
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

  const handleAddUser = (userToAdd) => {
    if (!userToAdd || !userToAdd._id) return;
    if (invitedMembers.some((m) => m._id === userToAdd._id)) {
      toast.info("User already added to list");
      return;
    }
    setInvitedMembers((prev) => [...prev, userToAdd]);
  };

  const handleRemoveInvitedUser = (userId) => {
    setInvitedMembers((prev) => prev.filter((member) => member._id !== userId));
  };

  const handleTeamInputChange = (e) => {
    const { name, value } = e.target;
    setTeamDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateGroup = async () => {
    if (!teamDetails.groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    try {
      setLoading(true);
      const finalGroupDetails = {
        ...teamDetails,
        createdBy: user._id,
        members: [],
        categories: selectedCategories,
      };
      const group = await dispatch(createGroup(finalGroupDetails)).unwrap();

      // Dispatch invitations to all selected users
      if (invitedMembers.length > 0 && group?.group?._id) {
        await Promise.all(
          invitedMembers.map((member) =>
            dispatch(
              sendInvitation({
                groupId: group.group._id,
                invitedTo: member._id,
              })
            ).unwrap()
          )
        );
      }

      setInvitedMembers([]);
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
      setCustomCategoryInput("");
      setTeamDetails({ groupName: "", description: "" });
      dispatch(resetSearchUsers());
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEditGroup = async () => {
    if (!teamDetails.groupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    try {
      setLoading(true);
      const data = {
        groupName: teamDetails.groupName,
        description: teamDetails.description,
        categories: selectedCategories,
      };
      await dispatch(updateGroup({ data, groupId: editableData?._id })).unwrap();
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
    }
  };
  //#endregion

  return (
    <Modal
      open={true}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(15, 23, 42, 0.65)",
      }}
    >
      <Fade in={true}>
        <Paper
          elevation={24}
          sx={{
            width: { xs: "92vw", sm: "80vw", md: "560px" },
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
                {editableData ? <EditIcon /> : <GroupAddIcon />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {editableData ? "Edit Group" : "Create New Group"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {editableData
                    ? "Update group name and description"
                    : "Set up your team and invite members"}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={onClose}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Body */}
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
            {/* Group Name Input */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 0.8 }}
              >
                Group Name <Box component="span" sx={{ color: "#1F7A6C" }}>*</Box>
              </Typography>
              <TextField
                name="groupName"
                value={teamDetails.groupName}
                onChange={handleTeamInputChange}
                placeholder="e.g. Goa Trip 2026 or Flatmates Expense"
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "&:hover fieldset": { borderColor: "#1F7A6C" },
                    "&.Mui-focused fieldset": { borderColor: "#1F7A6C" },
                  },
                }}
              />
            </Box>
            {/* Expense Categories Selection Section */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                Expense Categories <Box component="span" sx={{ color: "#1F7A6C" }}>*</Box>
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.2 }}>
                Click to select popular category tiles or type custom ones to customize this group
              </Typography>

              {/* Popular Categories Tiles */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                {POPULAR_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.name);
                  const isExisting = editableData && initialCategoriesRef.current.some(
                    (c) => c.toLowerCase() === cat.name.toLowerCase()
                  );

                  return (
                    <Chip
                      key={cat.name}
                      label={`${isExisting ? '🔒 ' : ''}${cat.icon} ${cat.name}`}
                      onClick={() => handleToggleCategory(cat.name)}
                      variant={isSelected ? "contained" : "outlined"}
                      sx={{
                        borderRadius: "10px",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        cursor: isExisting ? "default" : "pointer",
                        py: 1.8,
                        px: 0.5,
                        transition: "all 0.2s ease-in-out",
                        ...(isSelected
                          ? {
                              bgcolor: isExisting ? "#14532D" : "#1F7A6C",
                              color: "#FFFFFF",
                              borderColor: isExisting ? "#14532D" : "#1F7A6C",
                              boxShadow: "0 2px 8px rgba(31,122,108,0.3)",
                              "&:hover": { bgcolor: isExisting ? "#14532D" : "#176054" },
                            }
                          : {
                              bgcolor: "#F8FAFC",
                              color: "#64748B",
                              borderColor: "#CBD5E1",
                              "&:hover": { borderColor: "#1F7A6C", bgcolor: "#F1F5F9", color: "#1E293B" },
                            }),
                      }}
                    />
                  );
                })}
              </Box>

              {/* Custom Category Input & Add Button */}
              <Box sx={{ display: "flex", gap: 1, mb: 1.2 }}>
                <TextField
                  placeholder="Type custom category name (e.g. Snacks, Gym, Groceries)..."
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomCategory();
                    }
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
                  variant="outlined"
                  onClick={handleAddCustomCategory}
                  disabled={!customCategoryInput.trim()}
                  sx={{
                    borderRadius: "10px",
                    borderColor: "#1F7A6C",
                    color: "#1F7A6C",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2,
                    "&:hover": { bgcolor: "#E6F4F1", borderColor: "#176054" },
                    whiteSpace: "nowrap",
                  }}
                >
                  + Add
                </Button>
              </Box>

              {/* Display Custom / Additional Active Categories */}
              {selectedCategories.some((c) => !POPULAR_CATEGORIES.some((p) => p.name === c)) && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1, p: 1.2, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ width: "100%", mb: 0.5 }}>
                    Custom Categories Added:
                  </Typography>
                  {selectedCategories
                    .filter((c) => !POPULAR_CATEGORIES.some((p) => p.name === c))
                    .map((customCat) => {
                      const isExisting = editableData && initialCategoriesRef.current.some(
                        (c) => c.toLowerCase() === customCat.toLowerCase()
                      );

                      return (
                        <Chip
                          key={customCat}
                          label={`${isExisting ? '🔒 ' : '🏷️ '}${customCat}${isExisting ? ' (Existing)' : ' (Custom)'}`}
                          onDelete={isExisting ? undefined : () => handleRemoveCustomCategory(customCat)}
                          sx={{
                            borderRadius: "8px",
                            bgcolor: isExisting ? "#F1F5F9" : "#F0FDF4",
                            color: isExisting ? "#475569" : "#0D9488",
                            fontWeight: 700,
                            border: isExisting ? "1.5px solid #94A3B8" : "1.5px dashed #0D9488",
                            "& .MuiChip-deleteIcon": {
                              color: "#0D9488",
                              "&:hover": { color: "#115E59" },
                            },
                          }}
                        />
                      );
                    })}
                </Box>
              )}
            </Box>

            {/* Created By Card */}
            <Box
              sx={{
                bgcolor: "#F8FAFC",
                p: 1.5,
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Created By:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={user?.profile}
                  sx={{ width: 24, height: 24, bgcolor: "#1F7A6C", fontSize: 12 }}
                >
                  {user?.firstName?.charAt(0)}
                </Avatar>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {user?.firstName} {user?.lastName} ({user?.email})
                </Typography>
              </Box>
            </Box>

            {/* Add / Invite Members Section (Only for new group creation) */}
            {!editableData && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.8,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    Search & Invite Members
                  </Typography>
                  {invitedMembers.length > 0 && (
                    <Chip
                      label={`${invitedMembers.length} Selected`}
                      size="small"
                      sx={{
                        bgcolor: "#E6F4F1",
                        color: "#1F7A6C",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                  )}
                </Box>

                {/* Search Box */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    placeholder="Search by name or email (e.g., harsh, har, rkyharsu...)"
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

                {/* Search Results Display */}
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ py: 1 }}
                      >
                        No users found matching "{searchQuery}"
                      </Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          Found Users ({searchResults.length}):
                        </Typography>
                        {searchResults.map((foundUser) => {
                          const isAlreadyAdded = invitedMembers.some(
                            (m) => m._id === foundUser._id
                          );
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
                                  sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: "#1F7A6C",
                                    fontSize: 14,
                                  }}
                                >
                                  {foundUser.firstName?.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="text.primary"
                                    sx={{ lineHeight: 1.2 }}
                                  >
                                    {foundUser.firstName} {foundUser.lastName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {foundUser.email}
                                  </Typography>
                                </Box>
                              </Box>

                              <Button
                                size="small"
                                variant={isAlreadyAdded ? "outlined" : "contained"}
                                disabled={isAlreadyAdded}
                                onClick={() => handleAddUser(foundUser)}
                                startIcon={
                                  isAlreadyAdded ? <CheckIcon /> : <PersonAddIcon />
                                }
                                sx={{
                                  borderRadius: "8px",
                                  textTransform: "none",
                                  fontSize: "0.75rem",
                                  py: 0.4,
                                  px: 1.5,
                                  ...(isAlreadyAdded
                                    ? { borderColor: "#10B981", color: "#10B981" }
                                    : {
                                        bgcolor: "#1F7A6C",
                                        color: "#FFF",
                                        "&:hover": { bgcolor: "#176054" },
                                      }),
                                }}
                              >
                                {isAlreadyAdded ? "Added" : "Add"}
                              </Button>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Paper>
                )}

                {/* Selected Members Queue / Chips */}
                {invitedMembers.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="text.secondary"
                      sx={{ mb: 0.5, display: "block" }}
                    >
                      Invited List:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                      {invitedMembers.map((member) => (
                        <Chip
                          key={member._id}
                          avatar={
                            <Avatar src={member.profile} sx={{ bgcolor: "#1F7A6C" }}>
                              {member.firstName?.charAt(0)}
                            </Avatar>
                          }
                          label={`${member.firstName} ${member.lastName || ""}`}
                          onDelete={() => handleRemoveInvitedUser(member._id)}
                          sx={{
                            borderRadius: "10px",
                            bgcolor: "#E6F4F1",
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

            {/* Group Description */}
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 0.8 }}
              >
                Description
              </Typography>
              <TextField
                name="description"
                value={teamDetails.description}
                onChange={handleTeamInputChange}
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                placeholder="What is this group for? Add a short description..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "&:hover fieldset": { borderColor: "#1F7A6C" },
                    "&.Mui-focused fieldset": { borderColor: "#1F7A6C" },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Modal Footer Actions */}
          <Box
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#F8FAFC",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: "10px",
                borderColor: "#CBD5E1",
                color: "#64748B",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                "&:hover": { borderColor: "#94A3B8", bgcolor: "#F1F5F9" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={editableData ? handleEditGroup : handleCreateGroup}
              disabled={loading || !teamDetails.groupName.trim()}
              sx={{
                bgcolor: "#1F7A6C",
                color: "#FFFFFF",
                borderRadius: "10px",
                px: 3,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(31, 122, 108, 0.35)",
                "&:hover": { bgcolor: "#176054" },
              }}
            >
              {editableData ? "Update Group" : "Create Group"}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default AddTeam;
