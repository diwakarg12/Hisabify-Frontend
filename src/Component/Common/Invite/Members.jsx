import { Avatar, Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Members = ({ user, index, memberTab, owner, currentUserId, onRemoveMember, onCancelInvitation }) => {
  const isOwner = user._id === owner;
  const isCurrentUserOwner = Boolean(currentUserId && owner && String(currentUserId) === String(owner));

  return (
    <Box
      key={user._id || index}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.5,
        px: 2,
        my: 1,
        borderRadius: "12px",
        bgcolor: "#FFFFFF",
        border: "1px solid #F1F5F9",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          borderColor: "#E2E8F0",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={user.profile}
          sx={{
            width: 40,
            height: 40,
            bgcolor: isOwner ? "#1F7A6C" : "#3B82F6",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {user.firstName ? user.firstName.charAt(0) : "U"}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.2 }}>
            {user.firstName} {user.lastName || ""}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {memberTab ? (
          <Chip
            icon={isOwner ? <StarIcon style={{ fontSize: 14 }} /> : <PersonIcon style={{ fontSize: 14 }} />}
            label={isOwner ? "Owner" : "Member"}
            size="small"
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.75rem",
              px: 1,
              ...(isOwner
                ? { bgcolor: "#E6F4F1", color: "#1F7A6C", border: "1px solid #B2E2D9" }
                : { bgcolor: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0" }),
            }}
          />
        ) : (
          <Chip
            label="Pending Request"
            size="small"
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.75rem",
              bgcolor: "#FEF3C7",
              color: "#D97706",
              border: "1px solid #FDE68A",
            }}
          />
        )}

        {/* Remove Member Button (Owner only, cannot remove owner) */}
        {memberTab && isCurrentUserOwner && !isOwner && (
          <Tooltip title="Remove member from group">
            <IconButton
              size="small"
              onClick={() => onRemoveMember && onRemoveMember(user._id)}
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

        {/* Cancel Pending Invitation Button (Owner only) */}
        {!memberTab && isCurrentUserOwner && (
          <Tooltip title="Cancel / Delete invitation">
            <IconButton
              size="small"
              onClick={() => onCancelInvitation && onCancelInvitation(user.invitationId || user._id)}
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
    </Box>
  );
};

export default Members;
