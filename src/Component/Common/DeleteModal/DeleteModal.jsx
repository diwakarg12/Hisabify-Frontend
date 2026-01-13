//#region imports
import { Box, Button, Modal, Typography, Stack } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";

//#endregion

//#region Component make Styles
//#endregion

//#region interfaces & types
//#endregion

//#region Function Component
const DeleteModal = ({
  openDelete,
  setOpenDelete,
  handleDelete,
  title,
}) => {
  //#region Component states

  //#endregion

  //#region Component hooks

  React.useEffect(() => {
    // Anything in here is fired on component update.
  }, []);
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
    <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            component={"h2"}
            mb={2}
            sx={{
              textDecoration: "underline",
              textDecorationColor: "#F24E1E",
              textUnderlineOffset: "4px",
            }}
          >
            {title} Delete
          </Typography>
          <Button
            onClick={() => setOpenDelete(false)}
            sx={{
              textDecoration: "underline",
            }}
          >
            Go Back
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" fontSize={16}>
          Are you really sure you want to delete this {title}?
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3} fontSize={16}>
          This action cannot be undone.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {/* <Button
            variant="outlined"
            onClick={() => setOpenDeleteExpense(false)}
            sx={{ color: grey[700], borderColor: grey[400] }}
          >
            Cancel
          </Button> */}

          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              backgroundColor: red[500],
              "&:hover": { backgroundColor: red[700] },
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
  //#endregion
};
//#endregion

//#region Component export
export default DeleteModal;
//#endregion
