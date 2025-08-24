//#region imports
import {
  RadioButtonCheckedOutlined,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import upload_files from "../../../assets/upload_files.jpg";
import { green, red } from "@mui/material/colors";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const AddExpense = ({ openAddExpense, setOpenAddExpense }) => {
  //#region Component states
  const [category, setCategory] = useState("");
  const [creation, setCreation] = useState("");
  const [splitWith, setsplitWith] = useState([]);

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

  const handleAddClick = () => {
    setOpenAddExpense(false);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleChange = (event) => {
    setCreation(event.target.value);
    console.log("addinf for ", creation);
  };
  const handleSplitWithChange = (event) => {
    const {
      target: { value },
    } = event;

    setsplitWith(typeof value === "string" ? value.split(",") : value);
  };
  //#endregion

  //#region Component JSX.members
  const users = [
    {
      _id: 1,
      firstName: "Harsh",
      lastName: "Raj",
      email: "harsh@Gmail.com",
    },
    {
      _id: 2,
      firstName: "Rahul",
      lastName: "Raj",
      email: "rahul@Gmail.com",
    },
    {
      _id: 3,
      firstName: "Sumit",
      lastName: "Raj",
      email: "Sumith@Gmail.com",
    },
    {
      _id: 4,
      firstName: "Rohit",
      lastName: "Raj",
      email: "Rohit@Gmail.com",
    },
  ];

  //#endregion

  //#region Component renders
  return (
    <Box sx={{ p: 2 }}>
      <Modal
        open={openAddExpense}
        onClose={() => setOpenAddExpense(false)}
        closeAfterTransition
      >
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90vw",
              md: "70vw",
            },
            height: "80vh",
            backgroundColor: "white",
            boxShadow: 24,
            p: {
              xs: 3,
              md: 4,
            },
            borderRadius: 2,
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="h2">
              <Box
                component="span"
                sx={{
                  textDecoration: "underline",
                  textDecorationColor: "#F24E1E",
                  textUnderlineOffset: "4px",
                }}
              >
                Add Expen
              </Box>
              se
            </Typography>
            <Button
              onClick={() => setOpenAddExpense(false)}
              sx={{
                textDecoration: "underline",
              }}
            >
              Go Back
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: {
                xs: 0,
                md: 2,
              },
            }}
          >
            <TextField label="Amount" type="number" fullWidth sx={{ mt: 2 }} />
            <TextField
              label="Date"
              type="date"
              fullWidth
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box
            sx={{
              mt: {
                xs: 1.5,
                md: 2,
              },
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: {
                xs: 1.5,
                md: 2,
              },
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                {[
                  "shopping",
                  "Food & Dining",
                  "Groceries",
                  "Restaurants",
                  "Education",
                  "Travel",
                  "Entertainment",
                  "Health & Wellness",
                  "Gifts & Donations",
                  "Miscellaneous",
                ].map((category) => (
                  <MenuItem value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="adding-for">Adding For</InputLabel>
              <Select
                labelId="adding-for"
                id="adding-for"
                value={creation}
                label="Category"
                onChange={handleChange}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {users.map((user) => (
                  <MenuItem
                    value={user.email}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box component={"span"}>
                      {user.firstName} {user.lastName}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="split-with">Split With</InputLabel>
              <Select
                labelId="split-with"
                id="split-with"
                multiple
                value={splitWith}
                label="Split With"
                onChange={handleSplitWithChange}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {users.map((user) => (
                  <MenuItem
                    value={user.email}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box component={"span"}>
                      {user.firstName} {user.lastName}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              mt: {
                xs: 1.5,
                md: 2,
              },
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: {
                xs: 1,
                md: 2,
              },
            }}
          >
            <TextField
              label="Description"
              multiline
              rows={4}
              placeholder="Start writing here..."
              fullWidth
            />

            <Box
              sx={{
                border: "1px dashed grey",
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: {
                  xs: "100%",
                  md: "20%",
                },
                borderRadius: "3px",
              }}
            >
              <input
                accept="*"
                id="upload-file"
                type="file"
                style={{ display: "none" }}
                multiple
                // onChange={handleFileChange}
              />
              <InputLabel htmlFor="upload-file" sx={{ cursor: "pointer" }}>
                <img
                  src={upload_files}
                  style={{
                    height: "7.35rem",
                  }}
                />
              </InputLabel>
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddClick}
            sx={{
              mt: 2,
              backgroundColor: red[300],
              "&:hover": {
                background: green[600],
              },
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default AddExpense;
//#endregion
