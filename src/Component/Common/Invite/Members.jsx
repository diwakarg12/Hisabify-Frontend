//#region imports
import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Members = ({ user, index, memberTab, owner }) => {
  //#region Component states
  //#endregion

  //#region Component hooks
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  const handleCancelClick = () => {
    console.log("cancel clicked");
  };
  //#endregion

  //#region Component JSX.members

  //#endregion

  //#region Component renders
  return (
    <Box
      key={index}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mt={2}
    >
      <Box display="flex" alignItems="center">
        <Avatar src={user.profile} sx={{ mr: { xs: 1, sm: 2 } }} />
        <Box>
          <Typography>{user.firstName + " " + user.lastName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      {memberTab ? (
        <Typography
          sx={{
            border: "1.5px solid #E57373",
            padding: { xs: "0.5rem 1.25rem", sm: "0.5rem 2rem" },
          }}
        >
          {user._id === owner ? "Owner" : "Member"}
        </Typography>
      ) : (
        <Typography
          sx={{
            border: "1.5px solid #E57373",
            padding: { xs: "0.5rem 1.25rem", sm: "0.5rem 2rem" },
          }}
          onClick={handleCancelClick}
        >
          Cancel
        </Typography>
      )}
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default Members;
//#endregion
