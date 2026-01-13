//#region imports
import React from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { green, orange, red } from "@mui/material/colors";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Chart = ({ value, totValue, name, size, font }) => {
  //#region Component state
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
  const safeValue = Number(value) || 0;
  const safeTotal = Number(totValue) || 1;
  const percent = (safeValue / safeTotal) * 100;
  const safeSize = size || 200;
  //#endregion

  //#region Component renders
  return (
    <Gauge
      width={safeSize}
      height={safeSize}
      text={name}
      value={safeValue}
      valueMax={safeTotal}
      innerRadius="70%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: font,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill:
            (percent > 0) & (percent <= 33)
              ? green[800]
              : (percent > 33) & (percent <= 66)
              ? orange[800]
              : (percent > 66) & (percent <= 100)
              ? red[800]
              : theme.palette.text.disabled,
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
    />
  );
  //#endregion
};
//#endregion

//#region Component export
export default Chart;
//#endregion
