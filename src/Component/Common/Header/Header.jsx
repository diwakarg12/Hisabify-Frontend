/* eslint-disable no-unused-vars */

//#region imports
import React from 'react';
import Logo from "../../../assets/logo.png"
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import ProfileImg from '../../../assets/profile.jpg'
//#endregion

//#region Component make Styles
//#endregion


//#region Function Component
const Header = () => {
  //#region Component states
  const [currentDate , setCurrentDate] = React.useState("");
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
      const now = new Date();
      const formatted = now.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      setCurrentDate(formatted);
      console.log("formatteddfgh", formatted);
   },[]);
  //#endregion

  //#region Component use Styles
  ////#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods

  //#endregion

  //#region Component JSX.members
  const [dayPart, datePart, yearPart] = currentDate.split(', ') || [];
  
  // Convert MM/DD/YYYY → DD/MM/YYYY manually
  let formattedDate = '';
  if (datePart) {
    const [month, day] = datePart.split(' ');
    formattedDate = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${yearPart}`;
    console.log("formattedDate", formattedDate);
  }

  
  //#endregion

  //#region Component renders
  return(
  <div className='flex flex-row justify-between items-center bg-zinc-50 h-16 shadow-sm px-4'> 
     <div className='flex items-center space-x-2'>
        <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
          <img 
            src={Logo} 
            alt="logo" 
            className='w-8 h-8 object-contain'
          />
        </div>
        <div className='font-medium text-xl'>
          <span className='text-red-400'>Expense-</span>
          <span className='text-black'>Tracker</span>
        </div>
      </div>


<div className='flex items-center space-x-6'>
    
     <div className='text-right hidden md:block'>
          <div className='text-sm text-black'> {dayPart} </div>
          <div className='text-xs text-blue-400'>{formattedDate} </div>
     </div>
   
    <div className='flex space-x-2'>
      <div className='w-8 h-8 rounded bg-red-400 flex items-center justify-center'>
        <GroupAddOutlinedIcon className=' text-white' fontSize="medium" cursor="pointer" onClick = {() =>{
          console.log('Avatar cicked')
        }}/>
      </div>
      <div className='w-8 h-8 rounded bg-red-400 flex items-center justify-center' >
        <NotificationsOutlinedIcon className='text-white' fontSize="medium" cursor="pointer" onClick = {() =>{
          console.log('Avatar cicked')
        }}/>
      </div>
      <div className='w-8 h-8 rounded bg-red-400 flex items-center justify-center'>
        <CalendarMonthOutlinedIcon className='text-white' fontSize="medium" cursor="pointer" 
        onClick = {() =>{
          console.log('Avatar cicked')
        }}
       />
      </div>
      <div className='w-8 h-8 rounded flex items-center justify-center cursor-pointer'>
        <Avatar alt="R" src={ProfileImg} sx={{ bgcolor: red[400], width: 36, height:36}} 
        onClick = {() =>{
          console.log('Avatar cicked')
        }}
        />
      </div>
    </div>
   
     
</div>

  </div>);
  //#endregion
}
//#endregion

//#region Component export
export default Header;
//#endregion