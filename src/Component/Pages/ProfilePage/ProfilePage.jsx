//#region imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { EditSquare, SaveAs } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  updateEmail,
  updatePhone,
  updateProfile,
} from "../../../redux/authSlice";
import { toast } from "react-toastify";
import ProfilePhoto from "./ProfilePhoto";
dayjs.extend(utc);
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const ProfilePage = () => {
  //#region Component states
  const user = useSelector((store) => store.auth.user);
  console.log("user", user);
  const [editable, setEditable] = useState(false);
  const [userData, setUserData] = useState(user);
  const [emailUpdate, setEmailUpdate] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [uploading, setUploading] = useState(true);
  const dispatch = useDispatch();
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
  const handleProfileUpdate = async () => {
    setUploading(true);
    console.log("userData", userData);
    const userProfile = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      dob: userData.dob,
      gender: userData.gender,
      occupation: userData.occupation,
      income: userData.income,
      profile: userData.profile,
    };
    const response = await dispatch(updateProfile(userProfile)).unwrap();
    if (!response.error) {
      toast.success(response.message, {
        position: "top-center",
        theme: "dark",
      });
      navigate("/dashboard");
    } else {
      setUploading(false);
      toast.error(response.error, {
        position: "top-center",
        theme: "dark",
      });
    }
    setUploading(false);
  };
  //#endregion

  //#region Component feature methods
  const handleEdit = () => {
    setEditable((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailUpdate = async () => {
    console.log("userEmail", userData.email);
    const response = await dispatch(updateEmail(userData.email)).unwrap();
    if (!response.error) {
      toast.success(response.message, {
        position: "top-center",
        theme: "dark",
      });
    } else {
      toast.error(response.error, {
        position: "top-center",
        theme: "dark",
      });
    }
    setEmailUpdate((prev) => !prev);
  };

  const handlePhoneUpdate = async () => {
    console.log("userPhone", userData.phone);
    const response = await dispatch(updatePhone(userData.phone)).unwrap();
    if (!response.error) {
      toast.success(response.message, {
        position: "top-center",
        theme: "dark",
      });
    } else {
      toast.error(response.error, {
        position: "top-center",
        theme: "dark",
      });
    }
    setPhoneUpdate((prev) => !prev);
  };

  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return (
    <Box
      sx={{
        padding: 2,
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "2.5rem",
              lg: "3rem",
            },
          }}
        >
          Profile Information
        </Typography>
        <Link to="/home">
          <Typography
            sx={{
              textDecoration: "underline",
              ":hover": {
                cursor: "pointer",
                color: blue[500],
              },
            }}
          >
            Go Back
          </Typography>
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: {
            xs: 2,
            md: 3,
          },
          marginTop: 2,
          padding: 2,
        }}
      >
        <ProfilePhoto profile={userData.profile} setUserData={setUserData} uploading={uploading} />
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "1.3rem",
                sm: "1.5rem",
              },
              fontWeight: "bold",
              paddingBottom: "-0.5rem",
            }}
          >
            {`${userData.firstName} ${userData.lastName}`}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9rem",
            }}
          >
            {userData.email}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: {
            xs: "block",
            md: "flex",
          },
          gap: {
            xs: 0,
            md: 4,
          },
        }}
      >
        <Card
          sx={{
            backgroundColor: "#f5f7f7",
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
            borderBottomLeftRadius: {
              xs: 0,
              md: 1,
            },
            borderBottomRightRadius: {
              xs: 0,
              md: 1,
            },
            boxShadow: 1,
            height: "100%",
            width: {
              xs: "100%",
              md: "50%",
            },
          }}
        >
          <CardContent>
            {/* FirstName  */}
            <TextField
              id="outlined-basic"
              label="First Name"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              variant="outlined"
              disabled={!editable}
              type="text"
              sx={{
                width: "100%",
                marginBottom: 2,
              }}
            />

            {/* LastName */}
            <TextField
              id="outlined-basic"
              label="Last Name"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              variant="outlined"
              disabled={!editable}
              type="text"
              sx={{
                width: "100%",
                marginBottom: 2,
              }}
            />

            {/* Email  */}
            <Box sx={{ position: "relative", display: "flex" }}>
              <TextField
                id="outlined-basic"
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                variant="outlined"
                disabled={!emailUpdate}
                type="email"
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />
              <Button
                sx={{ position: "absolute", top: "0.4rem", right: "0.2rem" }}
              >
                {emailUpdate ? (
                  <SaveAs
                    onClick={handleEmailUpdate}
                    sx={{ fontSize: "2rem", color: "#ff6467" }}
                  />
                ) : (
                  <EditSquare
                    onClick={() => setEmailUpdate((prev) => !prev)}
                    sx={{ fontSize: "2rem", color: "#ff6467" }}
                  />
                )}
              </Button>
            </Box>

            <Box sx={{ position: "relative", display: "flex" }}>
              <TextField
                id="outlined-basic"
                label="Phone"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                variant="outlined"
                disabled={!phoneUpdate}
                type="text"
                sx={{
                  width: "100%",
                  marginBottom: {
                    xs: -3,
                    md: 3,
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield", // Firefox
                  },
                  "& input[type=number]::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                }}
              />
              <Button
                sx={{ position: "absolute", top: "0.4rem", right: "0.2rem" }}
              >
                {phoneUpdate ? (
                  <SaveAs
                    onClick={handlePhoneUpdate}
                    sx={{ fontSize: "2rem", color: "#ff6467" }}
                  />
                ) : (
                  <EditSquare
                    onClick={() => setPhoneUpdate((prev) => !prev)}
                    sx={{ fontSize: "2rem", color: "#ff6467" }}
                  />
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Card
          sx={{
            backgroundColor: "#f5f5f7",
            borderTopLeftRadius: {
              xs: 0,
              md: 1,
            },
            borderTopRightRadius: {
              xs: 0,
              md: 1,
            },
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
            boxShadow: 1,
            height: "100%",
            width: {
              xs: "100%",
              md: "50%",
            },
          }}
        >
          <CardContent>
            {/* Occupation */}
            <TextField
              id="outlined-basic"
              label="Occupation"
              name="occupation"
              value={userData.occupation}
              onChange={handleChange}
              variant="outlined"
              disabled={!editable}
              type="text"
              sx={{
                width: "100%",
                marginBottom: 2,
              }}
            />
            {/* Income */}
            <TextField
              id="outlined-basic"
              label="Income"
              name="income"
              value={userData.income}
              onChange={handleChange}
              variant="outlined"
              disabled={!editable}
              type="number"
              sx={{
                width: "100%",
                marginBottom: 2,
                "& input[type=number]": {
                  MozAppearance: "textfield", // Firefox
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 3,
              }}
            >
              {/* DOB  */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{
                    width: {
                      xs: "100%",
                      md: "70%",
                      lg: "50%",
                    },
                    marginBottom: {
                      xs: 0,
                      md: 1,
                    },
                  }}
                >
                  <DatePicker
                    value={dayjs.utc(userData.dob)}
                    label="Date of Birth"
                    sx={{
                      width: "100%",
                    }}
                    disabled={!editable}
                    onChange={(newValue) => {
                      setUserData((prev) => ({
                        ...prev,
                        dob: newValue.toDate(),
                      }));
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>

              {/* Gender  */}
              <FormControl
                sx={{
                  width: {
                    xs: "100%",
                    md: "50%",
                  },
                }}
              >
                <InputLabel id="gender">Gender</InputLabel>
                <Select
                  labelId="gender"
                  id="gender"
                  name="gender"
                  value={userData.gender}
                  label="Gender"
                  onChange={handleChange}
                  disabled={!editable}
                >
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"others"}>Others</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Buttons  */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginY: 2,
                width: "100%",
                gap: 3,
              }}
            >
              <button
                onClick={handleEdit}
                className="bg-red-400 text-white font-semibold py-3 rounded hover:bg-red-600 w-1/2 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleProfileUpdate}
                className="bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 w-1/2 cursor-pointer"
              >
                Save
              </button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default ProfilePage;
//#endregion
