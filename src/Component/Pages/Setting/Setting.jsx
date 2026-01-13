//#region imports
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Setting = () => {
  //#region Component states

  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, []);

  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
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
        backgroundColor: "#f6f9fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 1, md: 5 },
        px: { xs: 1, md: 4 },
      }}
    >
      <Card
        sx={{
          width: { xs: "98%", sm: "90%", md: "80%", lg: "80%" },
          boxShadow: 12,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: {
            xs: "86vh",
            md: "70vh",
          },
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 20 }}>
          Comming Soon
        </Typography>
      </Card>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default Setting;
//#endregion
