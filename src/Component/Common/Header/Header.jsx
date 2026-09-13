import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/authSlice';
import { getReceivedRequests } from '../../../redux/requestSlice';
import Logo from '../Primitives/Logo';
import Button from '../Primitives/Button';
import RequestDailog from '../Request/RequestDailog';
import NotificationDialog from '../Notification/NotificationDialog';
import { FaBell, FaUserPlus, FaSignOutAlt, FaMoon, FaSun, FaChartPie } from 'react-icons/fa';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [openRequests, setOpenRequests] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    navigate('/');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/myexpense') return 'Personal expenses';
    if (path === '/teamlist') return 'Group expenses';
    if (path.startsWith('/group-expense')) return 'Group expenses';
    if (path === '/setting') return 'Settings';
    if (path === '/contact') return 'Contact us';
    if (path === '/profile') return 'Profile';
    return '';
  };

  return (
    <header className="h-16 bg-[var(--surface-1)] border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between shadow-sm sticky top-0 z-40">
      {/* Brand Logo - ALWAYS links to / (Home page) */}
      <Link to="/" className="flex items-center" title="HisabiFY Home">
        <Logo size="md" />
      </Link>

      {/* Center Page Title */}
      <div className="hidden sm:block text-center flex-1">
        <h1 className="text-base font-semibold text-[var(--text-primary)]">{getPageTitle()}</h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <FaSun className="w-4 h-4 text-amber-400" /> : <FaMoon className="w-4 h-4" />}
        </button>

        {isAuthenticated ? (
          <>
            {/* Invitations / Requests */}
            <button
              onClick={() => {
                setOpenRequests(true);
                dispatch(getReceivedRequests());
              }}
              className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] flex items-center justify-center hover:border-[var(--brand)] transition-all"
              title="Group invitations"
            >
              <FaUserPlus className="w-4 h-4" />
            </button>
            <RequestDailog open={openRequests} onClose={() => setOpenRequests(false)} />

            {/* Notifications */}
            <button
              onClick={() => setOpenNotifications(true)}
              className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] flex items-center justify-center hover:border-[var(--brand)] transition-all"
              title="Notifications"
            >
              <FaBell className="w-4 h-4" />
            </button>
            <NotificationDialog open={openNotifications} onClose={() => setOpenNotifications(false)} />

            {/* Profile Avatar */}
            <Link
              to="/profile"
              className="w-9 h-9 rounded-full border-2 border-[var(--brand)] overflow-hidden shadow-sm flex items-center justify-center bg-[var(--surface-2)] text-[var(--brand)] font-bold text-sm hover:opacity-90"
              title="Profile"
            >
              {user?.profile ? (
                <img src={user.profile} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                user?.firstName?.[0] || 'U'
              )}
            </Link>

            {/* Logout button desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-secondary)] items-center justify-center hover:text-[var(--negative)] hover:border-[var(--negative)] transition-all"
              title="Log out"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button size="sm" variant="primary" onClick={() => navigate('/login')}>
              Get started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
