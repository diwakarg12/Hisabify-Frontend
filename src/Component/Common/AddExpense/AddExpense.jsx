
//#region imports
import { RadioButtonCheckedOutlined, RadioButtonUncheckedOutlined } from '@mui/icons-material';
import { Backdrop, Box, Button, Checkbox, FormControlLabel, InputLabel, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React from 'react';
import upload_files from '../../../assets/upload_files.jpg'
import { red } from '@mui/material/colors';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const AddExpense = ({openAddExpense , setOpenAddExpense}) => {
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
  const handleAddClick = () => {
    setOpenAddExpense(false);
  }
  
  

  //#endregion

  //#region Component renders
  return(
    <Box sx={{ p: 2 }}>
        <Modal
            open={openAddExpense}
            onClose={() => setOpenAddExpense(false)}
            closeAfterTransition
                >
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70vw',
                height:'80vh',
                backgroundColor: 'white',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                overflow:'auto'
             }}
         >
            <Typography variant="h6" component="h2">
                 Add Expense
            </Typography>
            <Button onClick={() => setOpenAddExpense(false)} sx={{ position: 'absolute', top: 8, right: 8 , textDecoration: 'underline'}}>
                 Go Back
            </Button>
            <Box sx={{display: 'flex' , gap : 2}}>
                <TextField label="Amount" type='number' fullWidth sx={{ mt: 2 }} />
                <TextField label="Date" type="date" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />  
            </Box>
            <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Category</Typography>
            <RadioGroup 
                row
                // value={value}
                >
            {["shopping", "Food & Dining", "Groceries", "Restaurants", "Education", "Travel", "Entertainment", "Health & Wellness", "Gifts & Donations", "Miscellaneous"].map((category) => (
                 <FormControlLabel value={category} control={<Radio/>} label={category} />
                 
            ))}
            </RadioGroup>
            </Box>
           
            <Box sx={{ mt: 2 , display: 'flex', gap: 2}}>
             <TextField
            label="Description"
            multiline
            rows={4}
            placeholder="Start writing here..."
            fullWidth
            />
             
            <Box
             sx={{
                border: '1px dashed grey',
                textAlign: 'center',
                cursor: 'pointer',
                width: '20%',
                borderRadius: '3px'
                }}
             >
           <input
                accept="*"
                id="upload-file"
                type="file"
                style={{ display: 'none' }}
                multiple
                // onChange={handleFileChange}
            />
            <InputLabel htmlFor="upload-file" sx={{cursor: 'pointer', }}>
                <img src={upload_files} style={{height:'7.35rem'}}/>
        
            </InputLabel>
            </Box>

            </Box>
            <Button variant="contained" fullWidth onClick={handleAddClick} sx={{ mt: 2 , backgroundColor: red[300]}}>
              Add
            </Button>
         </Box>
         </Modal>
     </Box>

  );
  //#endregion
}
//#endregion

//#region Component export
export default AddExpense;
//#endregion