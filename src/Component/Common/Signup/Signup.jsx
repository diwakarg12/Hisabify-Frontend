
//#region imports
import React from 'react';
import { 
  Box, 
  Paper,
  Typography,
  IconButton,
  Stack,
  Divider,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
 
 } from '@mui/material';
 import {
    Person,
    Lock,
    Phone,
    Email,
    HttpsOutlined,
 } from '@mui/icons-material';
 import signupImage from '../../../assets/Login/signup.svg';
 import { FaGithub, FaApple  } from "react-icons/fa";
 import { Google, Facebook, Twitter } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useDispatch } from 'react-redux';
import { register } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

 

 

//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Signup = ({isLogin , setIsLogin}) => {
  //#region Component states
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [user, setUser] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: '',
    dob: null,
    password: ''
  })
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
  const handleSignupFormChange = (e) =>{
    const {name, value} = e.target;
 
    setUser((prev)=>({
      ...prev,
      [name]: value
    }))
  }
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  const handleRegisterClick = async() =>{
    const formattedUser = {
      ...user,
    };
    const response = await dispatch(register(formattedUser)).unwrap();
    console.log('response', response)
      if(!response.error){
        toast.success(response.message,{
          position: 'top-center',
          theme: 'dark'
        });
        navigate('/profile');
      }else{
        toast.error(response.error,{
          position: 'top-center',
          theme: 'dark'
        });

      }
  }
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return(
  <Paper
        elevation={8}
        sx={{
            display: 'flex',
            borderRadius: 3,
            // height: '90%',
            width: '100wh',
            m: 'auto',
        }}>
          {/* Image in Sign Up Component  */}
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                p:6,
            }}>
            <Box
                component="img"
                src={signupImage}
                alt="Login"
                sx={{ maxWidth: '100%', height: 'auto' }}
                >

            </Box>
         </Box>
          {/* Form section */}
         <Box 
            sx={{
                display:'flex',
                flexDirection: 'column',
                flex:1,
                p: 6,
                justifyContent: 'center',
            }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom align="start">
                Sign Up
           </Typography>

           <Stack spacing={2} sx={{ mb: 2 }}>
            <TextField
             fullWidth
             placeholder="Enter First Name"
             name='firstName'
             value={user.firstName}
             onChange={handleSignupFormChange}
             variant="outlined"
             InputProps={{
             startAdornment: (
                <InputAdornment position="start">
                    <Person sx={{color: '#000'}}/>
                </InputAdornment>
                ),
            }}    
            />

            <TextField
             fullWidth
             placeholder="Enter Last Name"
             variant="outlined"
             name='lastName'
             value={user.lastName}
             onChange={handleSignupFormChange}
             InputProps={{
             startAdornment: (
                <InputAdornment position="start">
                    <Person sx={{color: '#000'}}/>
                </InputAdornment>
                ),
            }}    
            />
             <TextField
             fullWidth
             placeholder="Enter Phone"
             variant="outlined"
             name='phone'
             value={user.phone}
             onChange={handleSignupFormChange}
             InputProps={{
             startAdornment: (
                <InputAdornment position="start">
                    <Phone sx={{color: '#000'}}/>
                </InputAdornment>
                ),
            }}    
            />

            <TextField
             fullWidth
             placeholder="Enter Email"
             variant="outlined"
             name='email'
             value={user.email}
             onChange={handleSignupFormChange}
             InputProps={{
             startAdornment: (
                <InputAdornment position="start">
                    <Email sx={{color: '#000'}}/>
                </InputAdornment>
                ),
            }}    
            />

             <Box sx={{ minWidth: 120 }}>
               <FormControl sx={{width: '100%'}} >
                <Select
                  name='gender'
                  value={user.gender}
                  onChange={handleSignupFormChange}
                  displayEmpty
                  input={<OutlinedInput 
                  startAdornment={
                    <InputAdornment position="start">
                      <Person sx={{color: '#000'}}/> 
                    </InputAdornment>
                  }/>}          
                  inputProps={{ 'aria-label': 'Without label' }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return "Gender";
                    }
                    return selected;
                  }}
                   
                >
                  <MenuItem disabled value="">
                    <em>Gender</em>
                  </MenuItem>
                  <MenuItem value="male">
                    Male
                  </MenuItem>

                  <MenuItem value="female">
                    Female
                  </MenuItem>
                  <MenuItem value="other">
                    Other
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box >
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DatePicker  sx={{width: '100%'}}
                enableAccessibleFieldDOMStructure={false}
                name='dob'
                value={user.dob}
                onChange={(newValue) => {
                  setUser((prev) => ({
                    ...prev,
                    dob: newValue
                  }));
                }}
                  slots={{
                    textField: (props) =>(
                      <TextField
                      {...props}
                      
                      placeholder="Enter Date of Birth"
                    
                      
                      />
                    )
                  }}/>
              </LocalizationProvider>
            </Box>

            <TextField
             fullWidth
             placeholder="Enter Password"
             variant="outlined"
             id="outlined-basic"
             name='password'
             value={user.password}
             onChange={handleSignupFormChange}
             InputProps={{
             startAdornment: (
                <InputAdornment position="start">
                    <Lock sx={{color: '#000'}}/>
                </InputAdornment>
                ),
            }}    
            />

            <TextField
             fullWidth
             placeholder="Enter confirm Password"
             variant="outlined"
             name='confirmPassword'
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
             InputProps={{
             startAdornment: (
                <InputAdornment position="start">
                    <HttpsOutlined sx={{color: '#000'}}/>
                </InputAdornment>
                ),
            }}    
            />
           </Stack>

            <FormControlLabel
                control={<Checkbox />}
                label= "I agree to the Terms and Conditions"
                sx={{ mb: 2 }}
            />

           <Box>
              <Button
              variant="contained"
              fullWidth
              onClick={handleRegisterClick}
              sx={{
                mb: 2,
                py: 1,
                bgcolor: '#ff7171',
                '&:hover': { bgcolor: '#ff5252' },
              }}
            >
              Register
            </Button>
           </Box>
        

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Divider sx={{ flex: 1 }} />
                          <Typography variant="body2" sx={{ px: 2 }}>Or</Typography>
                          <Divider sx={{ flex: 1 }} />
                        </Box>
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2 }}>

            {/* <Typography variant="body1" sx={{}}>Login with</Typography> */}
            <Stack direction="row" sx={{justifyContent: 'space-between',alignItems:'baseline', width: '70%', }}>
                <IconButton sx={{ color: '#4285F4' }}>
                    <Google sx={{fontSize: 32}}/>
                </IconButton>
                 <IconButton sx={{ color: '#000' }}>
                    <FaApple size={35}/>
                </IconButton>
                <IconButton sx={{ color: '#1877F2',  }}>
                    <Facebook sx={{fontSize: 32}}/>
                </IconButton>
                 <IconButton sx={{ color: '#000' }}>
                    <FaGithub size={32}/>
                </IconButton>
                <IconButton sx={{ color: '#1DA1F2' }}>
                    <Twitter sx={{fontSize: 32}}/>
                </IconButton>
               
                
            </Stack>
         </Box>
          <Typography variant="body2" align="center" sx={{ mb: 2}}>
                 Already have an account?
                <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{ 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#3f51b5',
                    ml: 1,
                    }}
                 onClick={()=> setIsLogin(!isLogin)}
                >
                    Sign In 
                </Typography>
            </Typography> 
        </Box>

        
       </Paper>
  );
  //#endregion
}
//#endregion

//#region Component export
export default Signup;
//#endregion












<Box sx={{display: 'flex', flexDirection: 'row', gap: 2, position: 'relative'}}>
          
          
          
        </Box>