
//#region imports
import { Avatar, Box, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react';
import LandingPage from '../LandingPage/LandingPage';
import { Link } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import ProfileImg from '../../../assets/profile.jpg';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const ProfilePage = () => {
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
  //#endregion

  //#region Component renders
  return(
   <LandingPage>
     <Box sx={{ padding: 2,
                // height: '100%',
                width: '100%',
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                boxShadow: 1,
                
     }}>
       <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
       }}>
         <Typography variant="h4" >
            Profile Information
         </Typography>
         <Link to="/home"> 
              <Typography  sx={{
                textDecoration: 'underline',
                ":hover":{
                    cursor: 'pointer',
                    color: blue[500]
                }
              }}>
                 Go Back
              </Typography>
         </Link>
       </Box>
       <Box sx={{   
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        marginTop: 2,
        padding: 2,
       
       }}>
            <Avatar alt="R" src={ProfileImg} sx={{ width: 100, height:100}} 
        onClick = {() =>{
            console.log("Avatar clicked");
        }}
        />
            <Box>
                <Typography sx={{
                fontSize:'1.5rem',
                fontWeight: 'bold',
                paddingBottom: '-0.5rem',
            }}>
                Diwakar Giri
            </Typography>
            <Typography sx={{
                    fontSize: '0.9rem',
                }}>
                    dgiria@email.com
            </Typography>
            </Box>
       </Box>

       <Box sx={{
        display: 'flex',
        gap: 4,
       }}>
        <Card sx={{
            backgroundColor: '#f5f7f7',
                borderRadius: 1,
                boxShadow: 1,
                height: '100%',
                width: '50%',
        }}>
           <CardContent>
            {/* Name  */}
                <TextField id="outlined-basic" label="First Name" variant="outlined"  type='text'
                sx={{
                    width: '100%',
                    marginBottom: 2,
                }}/>
                <TextField id="outlined-basic" label="Last Name" variant="outlined" type='text'
                sx={{
                    width: '100%',
                    
                    marginBottom: 2,
                }}/>

                {/* Email  */}
                 <TextField id="outlined-basic" label="Email" variant="outlined" type='email'
                sx={{
                    width: '100%',
                    
                    marginBottom: 2,
                }}/>

                <TextField id="outlined-basic" label="Occupation" variant="outlined" type='text'
                sx={{
                    width: '100%',
                    marginBottom: 2,
                }}/>

                
       
           </CardContent>
        </Card>
        <Card sx={{
            backgroundColor: '#f5f5f7',
                borderRadius: 1,
                boxShadow: 1,
                height: '100%',
                width: '50%',
               
        }}>
              <CardContent>

                <TextField id="outlined-basic" label="Income" variant="outlined" type='number'
                sx={{
                    width: '100%',
                    marginBottom: 2,
                    '& input[type=number]': {
                    MozAppearance: 'textfield', // Firefox
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                    },
        
                }}/>
                  {/* DOB  */}
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']} sx={{
                        
                        marginBottom: 2,
                    }}>
                    <DatePicker label= "Date of Birth" sx={{
                        width: '100%',
                        marginBottom: 2,
                    }}/>
                </DemoContainer>
                </LocalizationProvider>

                {/* Gender  */}
                <FormControl fullWidth>
                <InputLabel id="gender">Gender</InputLabel>
                <Select
                    labelId="gender"
                    id="gender"
                    // value={age}
                    label="Gender"
                    // onChange={handleChange}
                >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                    <MenuItem value={"others"}>Others</MenuItem>
                </Select>
                </FormControl>

                {/* Buttons  */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    marginY: 2,
                    width: '100%',
                    gap: 2,
                }}>
                    <button className='bg-red-400 text-white font-semibold py-3 rounded hover:bg-red-600 w-2/5'>
                        Edit
                    </button>
                    <button className='bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 w-2/5'>
                        Save
                    </button>
                </Box>
              </CardContent>

        </Card>
       </Box>
    </Box>
   </LandingPage>
  );
  //#endregion
}
//#endregion

//#region Component export
export default ProfilePage;
//#endregion