/* eslint-disable no-unused-vars */

//#region imports
import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';

import profileImage from '../../../assets/profile.jpg';
import { Link, useNavigate } from 'react-router-dom';
//#endregion

//#region Component objects
  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon size={20} />, link: '/dashboard' },
    { name: 'My Expense', icon: <ReceiptIcon size={20} />, link: '/dashboard' },
    { name: 'Team Expense', icon: <GroupsIcon size={20} />, link: '/dashboard' },
    { name: 'Settings', icon: <SettingsIcon size={20} />, link: '/' },
    { name: 'Help', icon: <HelpIcon size={20} /> }
  ];
//#endregion


//#region Function Component
const SideNav = () => {
  //#region Component states
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('Dashboard');
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
    const handleMenuClick = (itemName) => {
    setActiveItem(itemName);
    
  };
  //#endregion

  //#region Component renders
  return(
   <div className={`h-[calc(100vh-4rem)]  bg-red-400 text-white flex flex-col transition-all duration-300 ease-in-out  ${
        isExpanded ? 'w-64 ' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}>

    {/* Menu items */}
     
      <div className="flex-grow py-4">
        {menuItems.map((item) => (
          <Link to={item.link}
            key={item.name}
            className={`flex items-center px-3 py-3 mx-2 my-1 rounded cursor-pointer group ${
              activeItem === item.name 
                ? 'bg-white bg-opacity-20' 
                : 'hover:bg-white hover:bg-opacity-20'
            }`}
          >
            <div className={`flex justify-center items-center ${
              activeItem === item.name 
                ? 'text-red-400' 
                : 'text-white group-hover:text-red-400'
            }`}>
              {item.icon}
            </div>
            <span className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
              activeItem === item.name 
                ? 'text-red-400' 
                : 'text-white group-hover:text-red-400'
            } ${
              isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Logout Section */}
      <div className="mt-auto mb-6">
        <div className="border-t border-red-300 my-2 mx-2"></div>
        <div className="flex items-center px-3 py-3 mx-2 rounded cursor-pointer group hover:bg-white hover:bg-opacity-20">
          <div className="text-white flex justify-center items-center group-hover:text-red-400">
            <LogoutIcon size={20} />
          </div>
          <span className={`ml-3 whitespace-nowrap text-white group-hover:text-red-400 ${
            isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          } transition-opacity duration-200`}>
            Logout
          </span>
        </div>
      </div>
      

   </div>
   );
  //#endregion
}
//#endregion

//#region Component export
export default SideNav;
//#endregion