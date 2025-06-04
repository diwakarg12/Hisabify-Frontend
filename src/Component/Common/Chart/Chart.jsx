/* eslint-disable no-unused-vars */

//#region imports
import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts'
import { red } from '@mui/material/colors';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Chart = ({value, totValue, name, size, font}) => {
   
  //#region Component states
 
  //#endregion

  //#region Component hooks
   React.useEffect(() => {
      // Anything in here is fired on component mount.
      return () => {
          // Anything in here is fired on component unmount.
      }
    }, [])

   React.useEffect(() => {
      // Anything in here is fired on component update.
   


   },[]);
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
  const percent = (value/totValue)*100
  
  //#endregion

  //#region Component renders
  return(
    <Gauge 
        width={size} 
        height={size} 
        text={name}
        value={value} 
        valueMax={totValue} 
        innerRadius="70%"
         sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: font,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: (percent > 0 & percent <=25 ) ? red[700] :
          (percent >25 & percent <=50) ? red[500] : (percent >50 & percent <= 75) ? red[300] :
           'green' ,
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}/>

      
  );
  //#endregion
}
//#endregion

//#region Component export
export default Chart;
//#endregion