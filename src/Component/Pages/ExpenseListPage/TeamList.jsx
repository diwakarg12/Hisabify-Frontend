//#region imports
import { Box, Button, Card } from "@mui/material";
import React from "react";
import TeamListCart from "../../Common/TeamListCart/TeamListCart";
import GroupsIcon from "@mui/icons-material/Groups";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const TeamList = () => {
  //#region Component states
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
  //#endregion

  //#region Component JSX.members
  const teamDetails = [
    {
      teamName: "Trip to patbna",
      totAmount: 1000,
      topCategory: "shoping",
      yourContribution: 200,
      lastTransaction: 400,
    },
    {
      teamName: "hajipur expense",
      totAmount: 1000,
      topCategory: "shoping",
      yourContribution: 200,
      lastTransaction: 400,
    },
    {
      teamName: "Team C",
      totAmount: 1000,
      topCategory: "shoping",
      yourContribution: 200,
      lastTransaction: 400,
    },
    {
      teamName: "Team D",
      totAmount: 1000,
      topCategory: "shoping",
      yourContribution: 200,
      lastTransaction: 400,
    },
  ];
  //#endregion

  //#region Component renders
  return (
    <Box
      sx={{
        position: "relative",
        paddingBottom: "4rem",
      }}
    >
      <Button
        variant="outlined"
        size="large"
        startIcon={<GroupsIcon />}
        onClick={() => {}}
        sx={{
          textTransform: "none",
          backgroundColor: "#ff6467",
          color: "white",
          position: "fixed",
          top: {
            xs: "6.75rem",
            md: "6rem",
          },
          right: {
            xs: "1rem",
            md: "3rem",
          },
          boxShadow: 3,
          fontWeight: 600,
          zIndex: 1000,
        }}
      >
        Add Team
      </Button>

      <Card>
        {teamDetails.map((teamDetail) => (
          <>
            <TeamListCart teamDetails={teamDetail} />
          </>
        ))}
      </Card>
    </Box>
  );
  //#endregion
};
//#endregion

//#region Component export
export default TeamList;
//#endregion
