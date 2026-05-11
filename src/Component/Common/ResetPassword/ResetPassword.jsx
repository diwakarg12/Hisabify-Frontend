//#region imports
import React from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Stack,
  IconButton,
  Paper,
} from "@mui/material";

import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Password,
} from "@mui/icons-material";
import bgImage from "../../../assets/Login/background.svg";
import loginImage from "../../../assets/Login/login.svg";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { sendResetOtp, verifyResetOtp } from "../../../redux/authSlice";
import { toast } from "react-toastify";
import FullScreenLoader from "../Loader/FullScreenLoader";
//#endregion

const ResetPassword = () => {
  //#region hooks
  const dispatch = useDispatch();
  const { authLoading } = useSelector((state) => state.auth);
  //#endregion

  //#region states
  const [otpSent, setOtpSent] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  //#endregion

  //#region handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    try {
      if (!form.email) {
        return toast.error("Email is required");
      }

      await dispatch(sendResetOtp(form.email)).unwrap();

      toast.success("OTP sent successfully");

      setOtpSent(true);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!form.otp || !form.newPassword || !form.confirmPassword) {
        return toast.error("All fields are required");
      }

      if (form.newPassword !== form.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      await dispatch(
        verifyResetOtp({
          email: form.email,
          otp: form.otp,
          newPassword: form.newPassword,
        }),
      ).unwrap();

      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error);
    }
  };
  //#endregion

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FF6767",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            borderRadius: 3,
            height: "90vh",
            width: "100vw",
          }}
        >
          {authLoading && <FullScreenLoader />}

          {/* LEFT */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              p: 6,
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
              align="start"
            >
              Reset Password
            </Typography>

            <Stack spacing={2} sx={{ mb: 2 }}>
              {/* EMAIL */}
              <TextField
                fullWidth
                placeholder="Enter Email"
                variant="outlined"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                disabled={otpSent}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#000" }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* SEND OTP BUTTON */}
              {!otpSent && (
                <Button
                  variant="contained"
                  onClick={handleSendOtp}
                  sx={{
                    py: 1,
                    bgcolor: "#ff7171",
                    "&:hover": {
                      bgcolor: "#ff5252",
                    },
                  }}
                >
                  Send OTP
                </Button>
              )}

              {/* OTP SECTION */}
              {otpSent && (
                <>
                  <TextField
                    fullWidth
                    placeholder="Enter OTP"
                    variant="outlined"
                    name="otp"
                    value={form.otp}
                    onChange={handleFormChange}
                  />

                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    variant="outlined"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Password sx={{ color: "#000" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    type="text"
                    placeholder="Confirm New Password"
                    variant="outlined"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "#000" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleResetPassword}
                    sx={{
                      py: 1,
                      bgcolor: "#ff7171",
                      "&:hover": {
                        bgcolor: "#ff5252",
                      },
                    }}
                  >
                    Update Password
                  </Button>
                </>
              )}
            </Stack>
            <Typography>
              Remember Password ?{" "}
              <Link
                to={"/login"}
                style={{
                  color: "#3f51b5",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Login Here
              </Link>
            </Typography>
          </Box>

          {/* RIGHT IMAGE */}
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              p: 6,
            }}
          >
            <Box
              component="img"
              src={loginImage}
              alt="Reset Password"
              sx={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
