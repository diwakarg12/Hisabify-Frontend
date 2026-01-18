//#region imports
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { red, grey } from "@mui/material/colors";
//#endregion

//#region Function Component
const NotFound = () => {
  //#region Component states
  const navigate = useNavigate();
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f6f9fc",
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 480,
          textAlign: "center",
          backgroundColor: "white",
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 80,
            color: red[400],
            mb: 1,
          }}
        />

        <Typography
          variant="h3"
          fontWeight={700}
          color="text.primary"
          gutterBottom
        >
          404
        </Typography>

        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Page Not Found
        </Typography>

        <Typography variant="body2" sx={{ color: grey[600], mb: 3 }}>
          The page you're looking for doesn't exist or was moved. Don't worry —
          let's get you back on track.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
          sx={{
            textTransform: "none",
            backgroundColor: "#ff6467",
            fontWeight: 600,
            px: 4,
            "&:hover": {
              backgroundColor: "#ff4f53",
            },
          }}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default NotFound;
//#endregion
