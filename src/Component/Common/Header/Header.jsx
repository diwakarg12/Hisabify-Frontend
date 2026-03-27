/* eslint-disable no-unused-vars */

//#region imports
import React from "react";
import Logo from "../../../assets/logo.png";
import {
  NotificationsOutlined,
  CalendarMonthOutlined,
  GroupAddOutlined,
  Menu,
  Close,
  Logout,
} from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import {
  Paper,
  Grid,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RequestDailog from "../Request/RequestDailog";
import NotificationDialog from "../Notification/NotificationDialog";
import CalenderDialog from "../Calender/CalenderDialog";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { getReceivedRequests } from "../../../redux/requestSlice";
import { logout } from "../../../redux/authSlice";
import { toast } from "react-toastify";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  //#region Component states
  const [currentDate, setCurrentDate] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openNotfication, setOpenNotification] = React.useState(false);
  const [openCalender, setOpenCalender] = React.useState(false);
  const [hamburderClick, setHamburgerClick] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  //#endregion

  //#region Component hooks

  React.useEffect(() => {
    // Anything in here is fired on component update.
    const now = new Date();
    const formatted = now.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setCurrentDate(formatted);
  }, []);
  //#endregion

  // #region Component use Styles
  //#endregion

  //#region Component validation methods
  const getHeaderTitle = () => {
    const path = location.pathname;

    if (path === "/myexpense") {
      return `${user?.firstName}'s Expense`;
    } else if (path === "/teamlist") {
      return "Your Groups";
    } else if (path.startsWith("/group-expense")) {
      return `${location.state?.groupName || "Group"} Expense`;
    } else {
      return "";
    }
  };
  //#endregion

  //#region Component Api methods
  const handleRequestDialog = async () => {
    setOpenDialog(true);
    const res = await dispatch(getReceivedRequests()).unwrap();
  };

  const handleLogoutClick = async () => {
    const response = await dispatch(logout()).unwrap();
    navigate("/");
    toast.success(response.message, { theme: "dark" });
  };
  //#endregion

  //#region Component feature methods
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleNotificationClick = () => {
    setOpenNotification(true);
  };

  const handleNotificationClose = () => {
    setOpenNotification(false);
  };

  const handleCalenderClick = () => {
    setOpenCalender(true);
  };

  const handleCalenderClose = () => {
    setOpenCalender(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const open = Boolean(openNotfication);
  const id = open ? "simple-popover" : undefined;
  //#endregion

  //#region Component JSX.members
  const [dayPart, datePart, yearPart] = currentDate.split(", ") || [];

  // Convert MM/DD/YYYY → DD/MM/YYYY manually
  let formattedDate = "";
  if (datePart) {
    const [month, day] = datePart.split(" ");
    formattedDate = `${day.padStart(2, "0")}-${month.padStart(
      2,
      "0",
    )}-${yearPart}`;
  }

  //#endregion

  //#region Component renders
  return (
    <div className="flex flex-row justify-between items-center bg-zinc-50 h-16 shadow-sm px-4">
      <Link to={"/"} className="flex items-center space-x-2">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <img
            src={Logo}
            alt="logo"
            className="w-12 h-12 object-contain cursor-pointer"
          />
        </div>
        {!isMobile && (
          <div className="font-medium text-xl">
            <span className="text-red-400">Hisabi</span>
            <span className="text-black">FY</span>
          </div>
        )}
      </Link>

      <Box sx={{ flex: 1, textAlign: "center" }}>
        <Typography variant={isMobile ? "h5":"h4"}>{getHeaderTitle()}</Typography>
      </Box>

      <div className="flex items-center space-x-6">
        <div className="text-right hidden md:block">
          <div className="text-sm text-black"> {dayPart} </div>
          <div className="text-xs text-blue-400">{formattedDate} </div>
        </div>

        {isAuthenticated ? (
          isMobile ? (
            <Box sx={{ position: "relative" }}>
              {hamburderClick ? (
                <IconButton
                  onClick={() => setHamburgerClick((prev) => !prev)}
                  sx={{
                    bgcolor: "#eee",
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Close sx={{ fontSize: "2rem" }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => setHamburgerClick((prev) => !prev)}
                  sx={{
                    bgcolor: "#eee",
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Menu sx={{ fontSize: "2rem" }} />
                </IconButton>
              )}
              {hamburderClick && (
                <Paper
                  elevation={6}
                  sx={{
                    position: "absolute",
                    top: 60,
                    right: -10,
                    p: 2,
                    borderRadius: 3,
                    width: 300,
                    zIndex: 1001,
                    transition: "all 0.3s ease",
                  }}
                >
                  <Grid container spacing={2}>
                    <div className="w-10 h-10 rounded bg-red-400 flex items-center justify-center">
                      <GroupAddOutlined
                        className=" text-white"
                        fontSize="medium"
                        cursor="pointer"
                        onClick={handleRequestDialog}
                      />
                      <RequestDailog
                        open={openDialog}
                        onClose={handleDialogClose}
                      />
                    </div>
                    <div className="w-10 h-10 rounded bg-red-400 flex items-center justify-center">
                      <NotificationsOutlined
                        className="text-white"
                        fontSize="medium"
                        cursor="pointer"
                        onClick={handleNotificationClick}
                      />
                      <NotificationDialog
                        open={open}
                        onClose={handleNotificationClose}
                      />
                    </div>
                    <div className="w-10 h-10 rounded bg-red-400 flex items-center justify-center">
                      <CalendarMonthOutlined
                        className="text-white"
                        fontSize="medium"
                        cursor="pointer"
                        onClick={handleCalenderClick}
                      />
                      <CalenderDialog
                        open={openCalender}
                        onClose={handleCalenderClose}
                      />
                    </div>
                    <Link
                      className="w-10 h-10 rounded flex items-center justify-center cursor-pointer "
                      to="/profile"
                    >
                      <Avatar
                        alt="R"
                        src={user?.profile}
                        sx={{
                          bgcolor: red[400],
                          width: 40,
                          height: 40,
                          border: "2px solid red",
                        }}
                      />
                    </Link>
                    <div className="w-10 h-10 rounded bg-red-400 flex items-center justify-center">
                      <Logout
                        className="text-white"
                        fontSize="medium"
                        cursor="pointer"
                        onClick={handleLogoutClick}
                      />
                    </div>
                  </Grid>
                </Paper>
              )}
            </Box>
          ) : (
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded bg-red-400 flex items-center justify-center">
                <GroupAddOutlined
                  className=" text-white"
                  fontSize="medium"
                  cursor="pointer"
                  onClick={handleRequestDialog}
                />
                <RequestDailog open={openDialog} onClose={handleDialogClose} />
              </div>
              <div className="w-8 h-8 rounded bg-red-400 flex items-center justify-center">
                <NotificationsOutlined
                  className="text-white"
                  fontSize="medium"
                  cursor="pointer"
                  onClick={handleNotificationClick}
                />
                <NotificationDialog
                  open={open}
                  onClose={handleNotificationClose}
                />
              </div>
              <div className="w-8 h-8 rounded bg-red-400 flex items-center justify-center">
                <CalendarMonthOutlined
                  className="text-white"
                  fontSize="medium"
                  cursor="pointer"
                  onClick={handleCalenderClick}
                />
                <CalenderDialog
                  open={openCalender}
                  onClose={handleCalenderClose}
                />
              </div>
              <Link
                className="w-8 h-8 rounded flex items-center justify-center cursor-pointer"
                to="/profile"
              >
                <Avatar
                  alt="R"
                  src={user?.profile}
                  sx={{ bgcolor: red[400], width: 40, height: 40 }}
                />
              </Link>
            </div>
          )
        ) : (
          <div>
            <Button
              variant="contained"
              fullWidth
              sx={{
                display: "flex",
                justifyContent: "center",
                bgcolor: "#ff7171",
                "&:hover": { bgcolor: "#ff5252" },
              }}
              onClick={handleLoginClick}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  //#endregion
};
//#endregion

//#region Component export
export default Header;
//#endregion
