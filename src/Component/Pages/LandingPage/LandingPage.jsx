import React from "react";
import Header from "../../Common/Header/Header.jsx";
import SideNav from "../../Common/SideNavBar/SideNav.jsx";
import { Box, useMediaQuery, useTheme } from "@mui/material";

const LandingPage = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ overflow: "hidden", height: isMobile ? "103vh" : "100vh" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
        }}
      >
        {/* Desktop SideNav */}
        {!isMobile && (
          <Box sx={{ flexShrink: 0 }}>
            <SideNav />
          </Box>
        )}

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            p: {
              xs: 0.5,
              sm: 1,
            },
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            paddingBottom: isMobile ? "56px" : 1,
          }}
        >
          {children}
        </Box>

        {/* Mobile Bottom Nav */}
        {isMobile && (
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: "56px",
              backgroundColor: theme.palette.background.paper,
              borderTop: `1px solid ${theme.palette.divider}`,
              zIndex: theme.zIndex.appBar,
            }}
          >
            <SideNav isMobile />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LandingPage;
