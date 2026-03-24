//#region imports
import React from "react";
import Loader from "react-js-loader";

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const FullScreenLoader = () => {
  //#region Component states

  //#endregion

  //#region Component hooks
  React.useEffect(() => {
    // Anything in here is fired on component mount.

    return () => {
      // Anything in here is fired on component unmount.
    };
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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Loader type="ping-cube" bgColor="#f44336" size={100} />
    </div>
  );
  //#endregion
};
//#endregion

//#region Component export
export default FullScreenLoader;
//#endregion
