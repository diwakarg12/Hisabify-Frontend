//#region imports
import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import ManageFinanceImg from "../../../assets/manageFinance.png";
import { useNavigate } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PieChartIcon from "@mui/icons-material/PieChart";
import SecurityIcon from "@mui/icons-material/Security";
import { red, grey } from "@mui/material/colors";
import LandingPage from "../LandingPage/LandingPage";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Home = () => {
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
  const featuresData = [
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
      title: "Personal Expense Tracking",
      desc: "Track daily spending with categories, analytics, and insights.",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: "Group Expense Management",
      desc: "Create groups, add members, and manage shared expenses easily.",
    },
    {
      icon: <PieChartIcon sx={{ fontSize: 40 }} />,
      title: "Smart Analytics",
      desc: "Visualize spending with charts, trends, and summaries.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure & Reliable",
      desc: "Your data is protected with authentication and access control.",
    },
  ];

  const userManual = [
    {
      step: "01",
      title: "Create an Account",
      desc: "Sign up and set up your profile in seconds.",
    },
    {
      step: "02",
      title: "Add Expenses",
      desc: "Add personal or group expenses and split them easily.",
    },
    {
      step: "03",
      title: "Track & Analyze",
      desc: "See insights, contributions, and expense summaries.",
    },
  ];
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
    <LandingPage navkey={"test"}>
      <Box sx={{ backgroundColor: "#f6f9fc" }}>
        {/* ================= HERO SECTION ================= */}
        <Box
          sx={{
            backgroundColor: "white",
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
            px: { xs: 2, md: 10 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Grid item xs={12} md={6} sx={{ p: { xs: 1, md: 4 } }}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Manage Expenses.
                <Box component="span" sx={{ color: red[400] }}>
                  {" "}
                  Split Smarter.
                </Box>
              </Typography>

              <Typography variant="body1" sx={{ color: grey[700], mb: 3 }}>
                Track personal expenses, manage group spending, split bills
                effortlessly, and stay in control of your finances — all in one
                place.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/dashboard")}
                sx={{
                  backgroundColor: "#ff6467",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                  "&:hover": {
                    transition: "0.3s",
                    backgroundColor: "#ff4f53",
                    transform: "translateY(-6px)",
                    boxShadow: 5,
                  },
                }}
              >
                Get Started
              </Button>
            </Grid>

            <Box
              component="div"
              sx={{
                width: "100%",
              }}
            >
              <Box
                component="img"
                src={ManageFinanceImg}
                alt="Expense Management"
                sx={{
                  height: { xs: "40vh", md: "100%" },
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 5,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ================= FEATURES SECTION ================= */}
        <Box
          sx={{
            px: { xs: 2, md: 10 },
            py: 10,
          }}
        >
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
            Powerful Features
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 2,
            }}
          >
            {featuresData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", sm: "48.5%" },
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    height: "100%",
                    textAlign: "center",
                    p: { xs: 2, md: 3 },
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: red[400], mb: 1 }}>{item.icon}</Box>

                    <Typography fontWeight={600} mb={1}>
                      {item.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ================= HOW IT WORKS ================= */}
        <Box
          sx={{
            backgroundColor: "white",
            px: { xs: 2, md: 10 },
            py: 10,
          }}
        >
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
            How It Works
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 2,
            }}
          >
            {userManual.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", sm: "48.5%" },
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h2" fontWeight={700} color={red[300]}>
                    {item.step}
                  </Typography>
                  <Typography fontWeight={600} mb={1}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ================= WHY CHOOSE US ================= */}
        <Box sx={{ px: { xs: 2, md: 10 }, py: 10 }}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
            Why Choose This App?
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            maxWidth={700}
            mx="auto"
          >
            Designed for simplicity, transparency, and collaboration — this app
            removes confusion from shared expenses and gives you full financial
            clarity.
          </Typography>
        </Box>
      </Box>
    </LandingPage>
  );
  //#endregion
};
//#endregion

//#region Component export
export default Home;
//#endregion
