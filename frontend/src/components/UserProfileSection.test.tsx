import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import UserProfileSection from './UserProfileSection';
import { UserRole } from '../types/user';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

describe('UserProfileSection Component', () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('Test User');
  });

  it('should render user name and role correctly', () => {
    const userRole: UserRole = 'admin';
    
    render(
      <UserProfileSection 
        userRole={userRole}
        onLogout={mockOnLogout}
      />
    );

    // Check if user name is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    
    // Check if role is displayed in uppercase
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    
    // Check if logout button is present
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('should display fallback username when localStorage is empty', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(
      <UserProfileSection 
        userRole="user"
        onLogout={mockOnLogout}
      />
    );

    // Should display fallback username
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('should handle logout functionality correctly', () => {
    render(
      <UserProfileSection 
        userRole="admin"
        onLogout={mockOnLogout}
      />
    );

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);

    // Check if localStorage methods were called
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('name');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('username');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('role');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    expect(mockLocalStorage.clear).toHaveBeenCalled();

    // Check if onLogout callback was called
    expect(mockOnLogout).toHaveBeenCalled();

    // Check if redirect to login was triggered
    expect(window.location.href).toBe('/login');
  });

  it('should apply custom className when provided', () => {
    const { container } = render(
      <UserProfileSection 
        userRole="user"
        onLogout={mockOnLogout}
        className="custom-class"
      />
    );

    const profileSection = container.firstChild as HTMLElement;
    expect(profileSection).toHaveClass('custom-class');
  });

  it('should display user role in uppercase format', () => {
    render(
      <UserProfileSection 
        userRole="user"
        onLogout={mockOnLogout}
      />
    );

    // Check if user role is displayed in uppercase
    expect(screen.getByText('USER')).toBeInTheDocument();
  });

  it('should have proper styling and accessibility attributes', () => {
    render(
      <UserProfileSection 
        userRole="admin"
        onLogout={mockOnLogout}
      />
    );

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    
    // Check if button has proper aria-label
    expect(logoutButton).toHaveAttribute('aria-label', 'Logout');
    
    // Check if button has proper type
    expect(logoutButton).toHaveAttribute('type', 'button');
    
    // Check if button has red styling classes
    expect(logoutButton).toHaveClass('text-red-500');
  });

  /**
   * Property 6: User profile information display
   * **Validates: Requirements 2.1, 2.2**
   * 
   * Property: For any authenticated user, their full name and role should be 
   * displayed in the profile section, with the role shown in uppercase format.
   * 
   * This property test verifies that:
   * - User's full name is always displayed (from localStorage or fallback)
   * - User's role is always displayed in uppercase format
   * - The profile section maintains correct information across different user configurations
   * 
   * The test generates various user configurations including different:
   * - User roles (admin/user)
   * - User names (including edge cases and fallback scenarios)
   * - localStorage states (present/absent data)
   */
  it('should display user profile information correctly for any user configuration', () => {
    fc.assert(
      fc.property(
        fc.record({
          // User role variations - both valid roles
          userRole: fc.constantFrom('admin', 'user'),
          
          // User name variations including edge cases
          userName: fc.oneof(
            fc.string({ minLength: 1, maxLength: 50 }), // Normal names
            fc.constant(''), // Empty string (should fallback)
            fc.constant('John Doe'), // Space in name
            fc.constant('محمد'), // Unicode characters
            fc.constant('User123'), // Alphanumeric
            fc.constant('A'), // Single character
            fc.constantFrom('Admin User', 'Test User', 'Jane Smith') // Common names
          ),
          
          // localStorage scenarios
          localStorageScenario: fc.constantFrom(
            'name', // Has 'name' key
            'username', // Has 'username' key  
            'both', // Has both keys (name takes priority)
            'none' // Has neither (fallback to 'User')
          ),
          
          // Additional props for robustness
          className: fc.oneof(
            fc.constant(''),
            fc.string({ maxLength: 30 })
          )
        }),
        ({ userRole, userName, localStorageScenario, className }) => {
          const mockOnLogout = vi.fn();
          cleanup();
          
          // Set up localStorage based on scenario
          mockLocalStorage.getItem.mockReset();
          
          switch (localStorageScenario) {
            case 'name':
              mockLocalStorage.getItem.mockImplementation((key: string) => 
                key === 'name' ? userName : null
              );
              break;
            case 'username':
              mockLocalStorage.getItem.mockImplementation((key: string) => 
                key === 'username' ? userName : null
              );
              break;
            case 'both':
              mockLocalStorage.getItem.mockImplementation((key: string) => 
                key === 'name' ? userName : (key === 'username' ? 'fallback' : null)
              );
              break;
            case 'none':
              mockLocalStorage.getItem.mockReturnValue(null);
              break;
          }
          
          render(
            <UserProfileSection 
              userRole={userRole as UserRole}
              onLogout={mockOnLogout}
              className={className}
            />
          );
          
          // Property 1: User's full name should always be displayed
          // Requirements 2.1: Display user's full name
          const expectedDisplayName = (() => {
            if (localStorageScenario === 'none') return 'User';
            if (localStorageScenario === 'name' || localStorageScenario === 'both') {
              // If userName is empty string or whitespace-only, it should fallback to 'User'
              return (userName || '').trim() || 'User';
            }
            if (localStorageScenario === 'username') {
              return (userName || '').trim() || 'User';
            }
            return 'User';
          })();
          
          // Handle the case where 'both' scenario has empty userName but non-empty username fallback
          const actualDisplayName = (() => {
            if (localStorageScenario === 'both' && !(userName || '').trim()) {
              // In "both" scenario with empty userName, component uses 'fallback' from username
              return 'fallback';
            }
            return expectedDisplayName;
          })();
          
          const displayedName = screen.getByText(actualDisplayName);
          expect(displayedName).toBeInTheDocument();
          expect(displayedName).toHaveClass('font-bold', 'text-gray-800');
          
          // Property 2: User's role should always be displayed in uppercase
          // Requirements 2.2: Display user's role in uppercase
          const expectedRoleDisplay = userRole.toUpperCase();
          const displayedRole = screen.getByText(expectedRoleDisplay);
          expect(displayedRole).toBeInTheDocument();
          expect(displayedRole).toHaveClass('uppercase', 'text-gray-500');
          
          // Verify both name and role are within the same profile section
          const profileContainer = displayedName.closest('.border-t');
          expect(profileContainer).toBeInTheDocument();
          expect(profileContainer).toContainElement(displayedRole);
          
          // Verify logout button is always present and accessible
          const logoutButton = screen.getByRole('button', { name: 'Logout' });
          expect(logoutButton).toBeInTheDocument();
          expect(logoutButton).toHaveClass('text-red-500');
        }
      ),
      { numRuns: 100 }
    );
  });
});