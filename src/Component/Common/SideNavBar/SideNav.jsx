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
//#endregion

//#region Component objects
  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon size={20} /> },
    { name: 'My Expense', icon: <ReceiptIcon size={20} /> },
    { name: 'Team Expense', icon: <GroupsIcon size={20} /> },
    { name: 'Settings', icon: <SettingsIcon size={20} /> },
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

    {/* Profile section only visiblewhen expanded  */}
       {/* <div className={`flex flex-col items-center border-b border-red-300 py-4 ${
        isExpanded ? 'opacity-100' : 'opacity-0 h-0 py-0 overflow-hidden'
      } transition-opacity duration-200`}>
        <div className="w-16 h-16 rounded-full bg-white overflow-hidden border-2 border-white mb-3">
          <img 
            src={profileImage}
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-medium">Anshu Bharti</h3>
        <p className="text-sm text-red-100">bhartianshu@gmail.com</p>
        </div> */}

        {/* whencollapsed  */}
        {/* <div className={`pb-4 flex justify-center border-b border-red-300 ${
        isExpanded ? 'opacity-0 h-0 py-0 overflow-hidden' : 'opacity-100'
      } transition-opacity duration-200`}>
        <div className="w-10 h-10 rounded-full bg-white overflow-hidden border-2 border-white">
          <img 
            src={profileImage}
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div> */}

    

    {/* Menu items */}
     
      <div className="flex-grow py-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleMenuClick(item.name)}
            className={`flex items-center px-3 py-3 mx-2 my-1 rounded cursor-pointer ${
              activeItem === item.name ? 'bg-white bg-opacity-20' : ''
            } hover:bg-white hover:text-red-400 hover: hover:bg-opacity-20 group`}
          >
            <div className={`${activeItem=== item.name ? 'text-red-400' : 'text-white'} hover:text-red-400  flex justify-center items-center"`}>
              {item.icon}
            </div>
            <span className={`ml-3 whitespace-nowrap ${activeItem === item.name ? 'text-red-400' : ''}  ${
              isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            } transition-opacity duration-200`}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Logout Section */}
      <div className="mt-auto mb-6">
        <div className="border-t border-red-300 my-2 mx-2"></div>
        <div className="flex items-center px-3 py-3 mx-2 rounded cursor-pointer hover:bg-white hover:bg-opacity-20 hover:text-red-400 group">
          <div className="text-white flex justify-center items-center hover:text-red-400">
            <LogoutIcon size={20} />
          </div>
          <span className={`ml-3 whitespace-nowrap ${
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