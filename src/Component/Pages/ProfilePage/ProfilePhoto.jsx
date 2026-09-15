import React, { useRef } from "react";
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { toast } from "react-toastify";

const ProfilePhoto = ({ profile, setUserData, editable }) => {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    // Only allow changing photo when in Edit mode
    if (!editable) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Image = reader.result;
      setUserData((prev) => ({
        ...prev,
        profile: base64Image,
      }));
    };
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: 90, sm: 110 },
        height: { xs: 90, sm: 110 },
        mx: "auto",
      }}
    >
      <Avatar
        src={profile}
        alt="Profile"
        onClick={handleAvatarClick}
        sx={{
          width: "100%",
          height: "100%",
          cursor: editable ? "pointer" : "default",
          border: "3px solid var(--brand)",
          boxShadow: "var(--shadow-3d)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: editable ? "scale(1.03)" : "none",
          },
        }}
      />

      {/* Camera Overlay Icon - Enabled only when in Edit mode */}
      {editable && (
        <Tooltip title="Change profile photo">
          <IconButton
            onClick={handleAvatarClick}
            size="small"
            sx={{
              position: "absolute",
              bottom: 2,
              right: 2,
              bgcolor: "var(--brand)",
              color: "#FFFFFF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              "&:hover": { bgcolor: "var(--brand-hover)" },
            }}
          >
            <CameraAltIcon style={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}

      <input
        type="file"
        hidden
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default ProfilePhoto;
