import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, checkAuth } from '../../../redux/authSlice';
import { toast } from 'react-toastify';

const menuItems = [
  { name: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
  { name: 'My Expense', icon: <ReceiptIcon />, link: '/myexpense' },
  { name: 'Team Expense', icon: <GroupsIcon />, link: '/teamlist' },
  { name: 'Settings', icon: <SettingsIcon />, link: '/setting' },
  { name: 'Help', icon: <HelpIcon />, link: '/help' },
];

const SideNav = ({ isMobile = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogoutClick = async () => {
    const response = await dispatch(logout()).unwrap();
    navigate('/login');
    toast.success(response.message, { theme: 'dark' });
    sessionStorage.removeItem('user');
  };

  // ========== 🟦 Mobile Bottom Navigation ========== //
  if (isMobile) {
    return (
      <div className="h-full w-full bg-red-400 text-white flex justify-around items-center">
        {menuItems.map((item) => (
          <Link key={item.link} to={item.link}>
            <div
              className={`flex flex-col items-center justify-center ${
                location.pathname === item.link
                  ? 'text-red-200'
                  : 'hover:text-red-300'
              }`}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // ========== 🟥 Desktop Sidebar ========== //
  return (
    <div
      className={`h-[calc(100vh-4rem)] bg-red-400 text-white flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex-grow py-4">
        {menuItems.map((item) => (
          <Link
            to={item.link}
            key={item.link}
            className={`flex items-center px-3 py-3 mx-2 my-1 rounded cursor-pointer group ${
              location.pathname === item.link
                ? 'bg-white bg-opacity-20'
                : 'hover:bg-white hover:bg-opacity-20'
            }`}
          >
            <div
              className={`flex justify-center items-center ${
                location.pathname === item.link
                  ? 'text-red-400'
                  : 'text-white group-hover:text-red-400'
              }`}
            >
              {item.icon}
            </div>
            <span
              className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                location.pathname === item.link
                  ? 'text-red-400'
                  : 'text-white group-hover:text-red-400'
              } ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Logout Section */}
      {isAuthenticated && (
        <div className="mt-auto mb-6">
          <div className="border-t border-red-300 my-2 mx-2"></div>
          <div
            onClick={handleLogoutClick}
            className="flex items-center px-3 py-3 mx-2 rounded cursor-pointer group hover:bg-white hover:bg-opacity-20"
          >
            <div className="text-white flex justify-center items-center group-hover:text-red-400">
              <LogoutIcon />
            </div>
            <span
              className={`ml-3 whitespace-nowrap text-white group-hover:text-red-400 ${
                isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              } transition-opacity duration-200`}
            >
              Logout
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
