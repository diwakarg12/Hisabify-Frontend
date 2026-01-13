//#region imports
import React from "react";
import { Dialog, DialogTitle, List, ListItem, Typography } from "@mui/material";
import RequestTile from "./RequestTile";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { reviewReceivedRequest } from "../../../redux/requestSlice";
import { getAllGroup } from "../../../redux/groupSlice";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const RequestDailog = ({ open, onClose }) => {
  //#region Component states
  const requests = useSelector((store) => store.request.receivedRequest);
  const dateObj = new Date(requests[0]?.updatedAt);
  const dispatch = useDispatch();

  //#endregion

  // #region Component hooks

  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  const handleRequestAction = async (status, requestId, groupId) => {
    await dispatch(
      reviewReceivedRequest({ status, requestId, groupId })
    ).unwrap();
    await dispatch(getAllGroup()).unwrap();
  };
  //#endregion

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return (
    <Dialog
      maxWidth={"xs"}
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-container": {
          justifyContent: {
            xs: "center",
            sm: "flex-end",
          },
          alignItems: "flex-start",
        },
        "& .MuiPaper-root": {
          margin: {
            xs: "60px 0px",
            sm: "60px 150px",
          },
          maxHeight: "70vh",
          backgroundColor: "rgba(255, 100, 103, 1)",
          scrollbarWidth: "none",
          scrollbarColor: "#fff rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: "1.8rem",
          alignItems: "center",
          color: "#fff",
        }}
      >
        Requests
        <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} />
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {requests && requests.length !== 0 ? (
          requests.map((request, index) => (
            <ListItem
              disablePadding
              key={`${request._id}-${index}`}
              sx={{ padding: "0.1rem 0.5rem" }}
            >
              <RequestTile
                request={request}
                dateObj={dateObj}
                handleRequestAction={handleRequestAction}
              />
            </ListItem>
          ))
        ) : (
          <ListItem disablePadding sx={{ padding: "0.1rem 0.5rem" }}>
            <Typography
              sx={{
                padding: "1rem 3rem",
                fontSize: 22,
                backgroundColor: "#fff",
                borderRadius: 1,
              }}
            >
              No Request Found
            </Typography>
          </ListItem>
        )}
      </List>
    </Dialog>
  );
  //#endregion
};
//#endregion

//#region Component export
export default RequestDailog;
//#endregion
