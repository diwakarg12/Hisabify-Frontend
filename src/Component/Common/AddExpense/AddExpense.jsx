//#region imports
import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import upload_files from "../../../assets/upload_files.jpg";
import { green, red } from "@mui/material/colors";
import { toast } from "react-toastify";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const AddExpense = ({
  openAddExpense,
  setOpenAddExpense,
  data,
  flag,
  handleAddExpense,
  editableData,
}) => {
  //#region Component states
  const fileInputRef = React.useRef(null);
  const isEdit = Boolean(editableData?._id);
  const [expense, setExpense] = React.useState({
    amount: "",
    description: "",
    date: "",
    category: "",
    createdFor: "",
    splitwith: [],
    receiptImage: "",
  });

  //#endregion

  //#region Component hooks

  React.useEffect(() => {
    // Anything in here is fired on component mount.
    if (flag === "personal" && data?.length) {
      const userId = data[0]._id;
      setExpense((prev) => ({
        ...prev,
        createdFor: userId,
        splitwith: [userId],
      }));
    }
  }, [flag, data]);

  React.useEffect(() => {
    if (editableData && editableData?._id) {
      setExpense({
        amount: editableData?.amount,
        description: editableData?.description,
        date: editableData?.date,
        category: editableData?.category,
        createdFor: editableData?.createdFor,
        splitwith:
          flag === "personal"
            ? [data[0]?._id]
            : editableData?.splitInfo?.splitBetween,
        receiptImage: editableData?.receiptImage,
      });
    }
  }, [editableData, flag, data]);

  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  const handleValueChange = (e) => {
    try {
      const { name, value } = e.target;
      setExpense((prev) => ({
        ...prev,
        [name]: value,
      }));
    } catch (error) {
      console.log("Error: ", error?.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Image = reader.result;

      // ✅ just update local state
      setExpense((prev) => ({
        ...prev,
        receiptImage: base64Image,
      }));
    };
  };

  const handleSplitWithChange = (event) => {
    const { value } = event.target;

    setExpense((prev) => ({
      ...prev,
      splitwith: typeof value === "string" ? value.split(",") : value,
    }));
  };
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods

  const handleButtonClick = () => {
    handleAddExpense(expense, isEdit, editableData?._id);

    setExpense({
      amount: "",
      description: "",
      date: "",
      category: "",
      addingFor: "",
      splitwith: [],
      receiptImage: "",
    });
    setOpenAddExpense(false);
  };
  //#endregion

  //#region Component JSX.members

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
                {editableData ? "Edit" : "Add"} {flag} Expen
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
            <TextField
              label="Amount"
              type="number"
              name="amount"
              fullWidth
              sx={{ mt: 2 }}
              value={expense.amount}
              onChange={handleValueChange}
            />
            <TextField
              label="Date"
              type="date"
              name="date"
              fullWidth
              sx={{ mt: 2 }}
              value={expense.date}
              onChange={handleValueChange}
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
                value={expense.category}
                label="Category"
                name="category"
                onChange={handleValueChange}
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
              <InputLabel id="created-for">Created For</InputLabel>
              <Select
                labelId="adding-for"
                id="created-for"
                name="createdFor"
                value={expense.createdFor}
                label="Created For"
                onChange={handleValueChange}
                disabled={flag === "personal"}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {data.map((user) => (
                  <MenuItem
                    value={user._id}
                    key={user._id}
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
                value={expense.splitwith}
                label="Split With"
                onChange={handleSplitWithChange}
                disabled={flag === "personal"}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {data.map((user) => (
                  <MenuItem
                    value={user._id}
                    key={user._id}
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
              name="description"
              value={expense.description}
              onChange={handleValueChange}
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
                accept="image/*"
                id="upload-file"
                type="file"
                name="receiptImage"
                ref={fileInputRef}
                style={{ display: "none" }}
                multiple
                onChange={handleFileUpload}
              />
              <InputLabel htmlFor="upload-file" sx={{ cursor: "pointer" }}>
                <img
                  src={
                    expense.receiptImage ? expense.receiptImage : upload_files
                  }
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
            onClick={handleButtonClick}
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
