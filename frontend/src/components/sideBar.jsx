import React, { useState } from 'react';
import { 
  Users, UserPlus , GraduationCap, FileText, BarChart3, Settings, Bell, Home,
  ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: 'dashboard' },
    { icon: Users, label: 'Students', href: 'studentView', active: currentPage === 'studentView' },
    { icon: GraduationCap, label: 'Teachers', href: 'teachers', active: currentPage === 'teachers' },
    { icon: UserPlus , label: 'Prefect', href: 'prefectManagement', active: currentPage === 'prefectManagement'  },
    { icon: FileText, label: 'Competition', href: 'competition', active: currentPage === 'competition'},
    { icon: BarChart3, label: 'Reports', href: 'reports' },
    { icon: Bell, label: 'Notifications', href: 'notifications', badge: '5' },
    { icon: Settings, label: 'Settings', href: 'settings' }
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
        {/* Header */}
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
              JD
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed left-0 top-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
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

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} isMobile={true} />
          ))}
        </nav>

        {/* Mobile User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-semibold">
              JD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;