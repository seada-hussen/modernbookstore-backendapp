import React from 'react';
import UserProfileSection from './UserProfileSection';
import { UserRole } from '../types/user';

interface SidebarNavigationProps {
  userRole: UserRole;
  onLogout: () => void;
  className?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

/**
 * SidebarNavigation Component
 * 
 * A fixed-width sidebar navigation component for the ReadOnce library interface.
 * Implements requirements 1.1-1.5 and 2.1-2.5 from the enhanced library interface spec.
 * 
 * Features:
 * - Fixed 256px width on desktop devices (hidden on mobile < 768px)
 * - ReadOnce branding header
 * - Complete navigation menu (Home, Community, Library, Reading, Vocabulary, Flashcards, Profile)
 * - Active state highlighting with amber background
 * - User profile section with name, role, and logout functionality
 * 
 * @param userRole - The user's role (admin/user) displayed in uppercase
 * @param onLogout - Callback function to handle user logout
 * @param className - Optional additional CSS classes
 */
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  userRole, 
  onLogout, 
  className = '' 
}) => {
  // Navigation items as specified in requirements
  // Requirements 1.2: Home, Community, Library, Reading, Vocabulary, Flashcards, Profile
  const navigationItems: NavigationItem[] = [
    { id: 'home', label: 'Home', icon: '🏠', href: '#', isActive: false },
    { id: 'community', label: 'Community', icon: '👥', href: '#', isActive: false },
    { id: 'library', label: 'Library', icon: '📚', href: '#', isActive: true }, // Library is active for enhanced library interface
    { id: 'reading', label: 'Reading', icon: '📖', href: '#', isActive: false },
    { id: 'vocabulary', label: 'Vocabulary', icon: '📝', href: '#', isActive: false },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏', href: '#', isActive: false },
    { id: 'profile', label: 'Profile', icon: '👤', href: '#', isActive: false },
  ];

  return (
    <aside 
      className={`sidebar-navigation w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between ${className}`}
      style={{ width: '256px' }} // Requirements 1.4: Fixed width of 256px
    >
      {/* Top section with title and navigation */}
      <div>
        {/* Requirements 1.1: ReadOnce title header with proper styling */}
        <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-wide">
          ReadOnce
        </h2>
        
        {/* Navigation items */}
        <nav className="space-y-2 text-sm font-medium text-gray-600">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                item.isActive
                  ? 'bg-amber-50 text-amber-800 font-semibold' // Requirements 1.3: Active state highlighting with amber background
                  : 'hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* User Profile Section - Requirements 2.1-2.5 */}
      <UserProfileSection 
        userRole={userRole}
        onLogout={onLogout}
      />
    </aside>
  );
};

export default SidebarNavigation;