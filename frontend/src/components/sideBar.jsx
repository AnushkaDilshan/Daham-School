import React, { useState } from 'react';
import { 
  Users, UserPlus, GraduationCap, FileText, BarChart3, Settings, Bell, Home,
  ChevronLeft, ChevronRight, Menu, X, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext'; // adjust path as needed

const Sidebar = ({ currentPage, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Get display name: prefer UserContext, fallback to JWT token
const getDisplayName = () => {
  if (user?.name) return user.name;
  if (user?.username) return user.username;
  if (user?.email) return user.email; // ← add this
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.name || decoded.username || decoded.email || 'User';
    }
  } catch (e) {}
  return 'User';
};

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null); // clears localStorage via UserContext useEffect
    navigate('/');
  };

  const displayName = getDisplayName();
  const initials = getInitials(displayName);

  const menuItems = [
    // { icon: Home, label: 'Dashboard', href: 'dashboard' },
       ...(user?.role === 'admin' ? [{ icon: Home, label: 'Dashboard', href: 'user-dashboard' }] : []),
    { icon: Users, label: 'Students', href: 'studentView', active: currentPage === 'studentView' },
    { icon: GraduationCap, label: 'Teachers', href: 'teachers', active: currentPage === 'teachers' },
    { icon: UserPlus, label: 'Prefect', href: 'prefectManagement', active: currentPage === 'prefectManagement' },
    { icon: FileText, label: 'Competition', href: 'competition', active: currentPage === 'competition' },
    // { icon: BarChart3, label: 'Reports', href: 'reports' },
    // { icon: Bell, label: 'Notifications', href: 'notifications', badge: '5' },
    // { icon: Settings, label: 'Settings', href: 'settings' }
  ];

  const MenuItem = ({ item, isMobile = false }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => {
          onNavigate(item.href);
          if (isMobile) setIsMobileMenuOpen(false);
        }}
        className={`
          w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
          ${item.active 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }
          ${isCollapsed && !isMobile ? 'justify-center' : ''}
        `}
      >
        <Icon size={20} className="flex-shrink-0" />
        <span className={`font-medium ${isCollapsed && !isMobile ? 'hidden' : 'block'}`}>
          {item.label}
        </span>
        {item.badge && (
          <span className={`
            ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center
            ${isCollapsed && !isMobile ? 'absolute -top-1 -right-1' : ''}
          `}>
            {item.badge}
          </span>
        )}
        {isCollapsed && !isMobile && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  // Reusable user profile + logout block
  const UserProfileBlock = ({ isMobile = false }) => (
    <div className="p-4 border-t border-gray-700">
      <div className={`flex items-center gap-3 ${isCollapsed && !isMobile ? 'justify-center flex-col' : ''}`}>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
          {initials}
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        )}
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className={`
            flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors p-1 rounded
            ${isCollapsed && !isMobile ? 'mt-1' : ''}
          `}
        >
          <LogOut size={16} />
          {(!isCollapsed || isMobile) && (
            <span className="text-xs">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:flex flex-col bg-gray-800 text-white h-screen transition-all duration-300 relative
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-blue-400">EduManage</h1>
                <p className="text-xs text-gray-400">Student Management</p>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </nav>

        <UserProfileBlock />
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed left-0 top-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-400">EduManage</h1>
            <p className="text-xs text-gray-400">Student Management</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} isMobile={true} />
          ))}
        </nav>

        <UserProfileBlock isMobile={true} />
      </div>
    </>
  );
};

export default Sidebar;