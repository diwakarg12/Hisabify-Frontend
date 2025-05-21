/* eslint-disable no-unused-vars */

//#region imports
import React from 'react';
import  bgImage from '../../../assets/Login/background.svg';
import loginImage from '../../../assets/Login/login.svg';
import signupImage from '../../../assets/Login/signup.svg';
import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  AccountCircle,
  AlternateEmail,
  Facebook,
  Google,
  Lock,
  Person,
  Twitter,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import PersonalInjuryOutlinedIcon from '@mui/icons-material/PersonalInjuryOutlined';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import Login from '../../Common/Login/Login';
import Signup from '../../Common/Signup/Signup';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Loginsignup = () => {
  //#region Component states
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return(
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FF6767',
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        overflow: 'hidden',
      }} 
      
    >
      <Container 
      className="scrollbar-hide"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
      display: 'none',
    },
      }}>
        {!isLogin ? (
        <Signup />
        ) : (
         <Login />
        )}
        
      </Container>
    </Box>
);
  //#endregion
}
//#endregion 

//#region Component export
export default Loginsignup;
//#endregion