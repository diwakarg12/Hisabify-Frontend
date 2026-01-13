//#region imports
import { Box, Button, Typography } from "@mui/material";
import React from "react";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const RequestTile = ({ dateObj, request, handleRequestAction }) => {
  //#region Component states
  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, []);

  React.useEffect(() => {
    // Anything in here is fired on component update.
  });
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  const date = dateObj.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 1,
      }}
    >
      <Typography
        sx={{
          color: "black",
          padding: "1rem",
          paddingBottom: "0rem",
          fontSize: "16px",
        }}
      >
        Requesting You to add in {request.groupId.groupName}.
      </Typography>
      <Typography
        sx={{ paddingLeft: "1rem", color: "#A1A3AB", fontSize: "12px" }}
      >
        By {request.invitedBy.firstName} {request.invitedBy.lastName} at {time}{" "}
        on {date}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, padding: "0.5rem 1rem" }}>
        <Button
          variant="contained"
          color="success"
          sx={{
            borderRadius: "15px",
            padding: "0.25rem 1rem",
          }}
          onClick={() =>
            handleRequestAction("accepted", request._id, request.groupId._id)
          }
        >
          Accept
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{
            borderRadius: "15px",
            padding: "0.25rem 1rem",
          }}
        >
          Reject
        </Button>
      </Box>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default RequestTile;
//#endregion
