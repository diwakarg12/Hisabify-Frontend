//#region imports
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../../redux/messageSlice";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Contact = () => {
  const dispatch = useDispatch();
  //#region Component states
  const user = useSelector((store) => store.auth.user);
  const [form, setForm] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: user?.phone,
    title: "",
    message: "",
  });
  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, [dispatch]);

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {

    await dispatch(sendMessage(form)).unwrap();

    setForm({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      title: "",
      message: "",
    });
  };
  //#endregion

  //#region Component JSX.members

  //#endregion

  //#region Component renders
  return (
    <Box
      sx={{
        minHeight: {
          xs: "86vh",
          md: "96vh",
        },
        backgroundColor: "#f6f9fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 1, md: 4 },
      }}
    >
      <Card
        sx={{
          width: { xs: "98%", sm: "90%", md: "80%", lg: "80%" },
          boxShadow: 12,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 3 } }}>
          {/* Header */}
          <Typography
            variant="h5"
            fontWeight={600}
            mb={3}
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#F24E1E",
              textUnderlineOffset: "4px",
            }}
          >
            Contact Us
          </Typography>

          {/* Name Fields */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={form.firstName}
              onChange={handleChange}
              disabled
            />
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={form.lastName}
              onChange={handleChange}
              disabled
            />
          </Box>

          {/* Email & Phone */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              disabled
            />
            <TextField
              label="Phone"
              name="phone"
              type="tel"
              fullWidth
              value={form.phone}
              onChange={handleChange}
              disabled
            />
          </Box>

          {/* Message Title */}
          <TextField
            label="Title"
            name="title"
            type="text"
            fullWidth
            sx={{ mt: 2 }}
            value={form.title}
            onChange={handleChange}
          />

          {/* Message */}
          <TextField
            label="Message"
            name="message"
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
            value={form.message}
            onChange={handleChange}
          />

          {/* Submit */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              mt: 2,
              backgroundColor: red[300],
              "&:hover": {
                backgroundColor: green[600],
              },
              fontWeight: 600,
            }}
          >
            Send Message
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default Contact;
//#endregion
