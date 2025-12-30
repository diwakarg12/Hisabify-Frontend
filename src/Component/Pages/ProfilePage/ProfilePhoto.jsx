import React, { useRef } from "react";
import { Avatar, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const ProfilePhoto = ({ profile, setUserData, uploading }) => {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validations
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

      // ✅ just update local state
      setUserData((prev) => ({
        ...prev,
        profile: base64Image,
      }));
    };
  };

  return (
    <Box sx={{ position: "relative", width: 100 }}>
      <Avatar
        src={profile}
        alt="Profile"
        sx={{
          width: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
          cursor: "pointer",
        }}
        onClick={handleAvatarClick}
      />

      {uploading && (
        <CircularProgress
          size={100}
          thickness={2}
          sx={{
            color: "#ff6467",
            position: "absolute",
            top: "0%",
            left: "0%",
            transform: "translate(-50%, -50%)",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
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
