//#region imports
import React from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Stack,
  IconButton,
  Paper,
} from "@mui/material";
import { Person, Facebook, Google, Twitter, Lock } from "@mui/icons-material";
import loginImage from "../../../assets/Login/login.svg";
import { FaGithub, FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, checkAuth } from "../../../redux/authSlice";
import { toast } from "react-toastify";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Login = ({ isLogin, setIsLogin }) => {
  //#region Component states
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = React.useState(false);
  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  React.useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //#endregion

  //#region Component Api methods
  const handleLoginClick = async () => {
    try {
      await dispatch(login(form)).unwrap();
      toast.success("Login Sucessful !");
      navigate("/");
    } catch (error) {
      toast.error("Email or Password is not correct", error?.message);
    }
    // if(rememberMe){
    //     sessionStorage.setItem('user', JSON.stringify(response.user));
    // }
  };
  //#endregion

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return (
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
          Sign In
        </Typography>

        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Enter Phone/Email"
            variant="outlined"
            name="email"
            value={form.email}
            onChange={handleFormChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: "#000" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            placeholder="Enter Password"
            variant="outlined"
            name="password"
            value={form.password}
            onChange={handleFormChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#000" }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <FormControlLabel
          control={<Checkbox />}
          label="Remember Me"
          sx={{ mb: 2 }}
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />

        <Box>
          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mb: 2,
              py: 1,
              bgcolor: "#ff7171",
              "&:hover": { bgcolor: "#ff5252" },
            }}
            onClick={handleLoginClick}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" sx={{ px: 2 }}>
            Or
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "baseline",
              width: "70%",
            }}
          >
            <IconButton sx={{ color: "#4285F4" }}>
              <Google sx={{ fontSize: 32 }} />
            </IconButton>
            <IconButton sx={{ color: "#000" }}>
              <FaApple size={35} />
            </IconButton>
            <IconButton sx={{ color: "#1877F2" }}>
              <Facebook sx={{ fontSize: 32 }} />
            </IconButton>
            <IconButton sx={{ color: "#000" }}>
              <FaGithub size={32} />
            </IconButton>
            <IconButton sx={{ color: "#1DA1F2" }}>
              <Twitter sx={{ fontSize: 32 }} />
            </IconButton>
          </Stack>
        </Box>
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          Don't have an account?
          <Typography
            component="span"
            variant="body2"
            color="primary"
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#3f51b5",
            }}
            onClick={() => setIsLogin(!isLogin)}
          >
            Create One
          </Typography>
        </Typography>
      </Box>

      {/* Image thing  */}
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
          alt="Login"
          sx={{ maxWidth: "100%", height: "auto" }}
        ></Box>
      </Box>
    </Paper>
  );
  //#endregion
};
//#endregion

//#region Component export
export default Login;
//#endregion
