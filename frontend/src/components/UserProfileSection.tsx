import React from 'react';
import { UserRole } from '../types/user';

interface UserProfileSectionProps {
  userRole: UserRole;
  onLogout: () => void;
  className?: string;
}

/**
 * UserProfileSection Component
 * 
 * A dedicated component for displaying user profile information and logout functionality
 * in the sidebar navigation. Implements requirements 2.1-2.5 from the enhanced library interface spec.
 * 
 * Features:
 * - Displays user's full name retrieved from localStorage
 * - Shows user's role in uppercase format (admin/user)
 * - Red-styled logout button with hover effects
 * - Positioned with top border separator
 * - Clear localStorage and redirect to login on logout
 * 
 * Requirements Coverage:
 * - 2.1: Display user's full name
 * - 2.2: Display user's role in uppercase
 * - 2.3: Logout button with red styling
 * - 2.4: Clear localStorage and redirect to login
 * - 2.5: Position at bottom with top border separator
 * 
 * @param userRole - The user's role (admin/user) to display
 * @param onLogout - Callback function to handle logout functionality
 * @param className - Optional additional CSS classes
 */
const UserProfileSection: React.FC<UserProfileSectionProps> = ({ 
  userRole, 
  onLogout, 
  className = '' 
}) => {
  // Get user's full name from localStorage with fallback
  // Requirements 2.1: Display user's full name
  const userName = (localStorage.getItem('name') || '').trim() || 
                   (localStorage.getItem('username') || '').trim() || 
                   'User';

  /**
   * Handle logout functionality
   * Requirements 2.4: Clear localStorage and redirect to login
   */
  const handleLogout = () => {
    try {
      // Clear all authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      // Clear entire localStorage to ensure no session data remains
      localStorage.clear();
      
      // Call the parent logout handler
      onLogout();
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Still attempt to redirect even if localStorage operations fail
      window.location.href = '/login';
    }
  };

  return (
    <div className={`border-t border-gray-200 pt-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* User profile information section */}
        <div className="flex-1">
          {/* Requirements 2.1: Display user's full name */}
          <p className="text-sm font-bold text-gray-800 leading-tight">
            {userName}
          </p>
          
          {/* Requirements 2.2: Display user's role in uppercase */}
          <p className="text-xs text-gray-500 uppercase font-medium mt-1">
            {userRole.toUpperCase()}
          </p>
        </div>
        
        {/* Requirements 2.3: Logout button with red styling and proper functionality */}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          type="button"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfileSection;