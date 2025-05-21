
//#region imports
import { Box, Container } from '@mui/material';
import React from 'react';
import { 
    TextField,
    Typography,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Button,
    Divider,
    Stack,
    IconButton,
    Paper
 } from '@mui/material';
 import {
    Person,
    Facebook,
    Google,
    Twitter,
    Lock
 } from '@mui/icons-material';
 import EmailIcon from '@mui/icons-material/Email';
 import loginImage from '../../../assets/Login/login.svg';
 import { FaGithub, FaApple  } from "react-icons/fa";


 
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Login = () => {
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
  <Paper
        elevation={3}
        sx={{
            display: 'flex',
            overflow: 'hidden',
            borderRadius: 3,
            height: '90vh',
            width: '100wh',
            
        }}>
         <Box 
            sx={{
                display:'flex',
                flexDirection: 'column',
                flex:1,
                p: 6,
                justifyContent: 'center',
            }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom align="start">
                Sign In
           </Typography>

           <Stack spacing={2} sx={{ mb: 2 }}>
            <TextField
             fullWidth
             placeholder="Enter Phone/Email"
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
             placeholder="Enter Password"
             variant="outlined"
             InputProps={{
             startAdornment: (
                <InputAdornment position="start">
                    <Lock sx={{color: '#000'}}/>
                </InputAdornment>
                ),
            }}    
            />
           </Stack>

            <FormControlLabel
                control={<Checkbox />}
                label= "Remember Me"
                sx={{ mb: 2 }}
            />

           <Box>
              <Button
              variant="contained"
              fullWidth
              sx={{
                mb: 2,
                py: 1,
                bgcolor: '#ff7171',
                '&:hover': { bgcolor: '#ff5252' },
              }}
            >
              Login
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
                 Don't have an account?
                <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{ 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#3f51b5'
                    }}
                //  onClick={toggleForm}
                >
                    Create One 
                </Typography>
            </Typography> 
        </Box>

        {/* Image thing  */}
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
                src={loginImage}
                alt="Login"
                sx={{ maxWidth: '100%', height: 'auto' }}
                >

            </Box>
         </Box>
       </Paper>
  );
  //#endregion
}
//#endregion

//#region Component export
export default Login;
//#endregion