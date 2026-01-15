//#region imports
import { getLabel } from "@mui/x-charts/internals";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import React from "react";
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const MultiChart = ({ data, outerRadius }) => {
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
  const sizing = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    // hideLegend: true,
  };
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  const getArcLabel = (params) => {
    const value = Number(params.value);
    const percent = value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };
  console.log("getArc", getLabel);
  //#endregion

  //#region Component JSX.members
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);
  console.log("Value", TOTAL);
  //#endregion

  //#region Component renders
  return (
    <PieChart
      series={[
        {
          outerRadius: outerRadius,
          data,
          arcLabel: getArcLabel,
        },
      ]}
      legend={{
        direction: "column", // 'row' | 'column'
        position: {
          vertical: "top", // 'top' | 'middle' | 'bottom'
          horizontal: "middle", // 'left' | 'middle' | 'right'
        },
      }}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: "white",
          fontSize: 14,
        },
      }}
      {...sizing}
    />
  );
  //#endregion
};
//#endregion

//#region Component export
export default MultiChart;
//#endregion
