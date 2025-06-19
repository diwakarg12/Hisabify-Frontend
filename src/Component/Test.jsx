//#region imports
import React from 'react';
import LandingPage from '../Component/Pages/LandingPage/LandingPage';
import { Button, Box, Card } from '@mui/material';
import AddExpense from './Common/AddExpense/AddExpense';
import { useSelector , useDispatch } from 'react-redux';
import { increment , decrement } from '../redux/counterSlice'; // Update the path as needed
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Test = () => {
  //#region Component states
  const dispatch = useDispatch();
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
   });
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  const counter = useSelector((state) => state.count.counter);
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return(
    <LandingPage navkey={"test"}>
         <content>
          <div> Page not Found {counter} </div>
         </content>
         
         
          <Box>
            <Button variant="contained" color="primary" onClick={ () => dispatch(increment(1))}>
              ++ 
            </Button>
            <Button variant="contained" color="secondary" onClick={ () => dispatch(decrement(1))}>
              --
            </Button>
          </Box>
    </LandingPage>
  );
  //#endregion
}
//#endregion

//#region Component export
export default Test;
//#endregion

